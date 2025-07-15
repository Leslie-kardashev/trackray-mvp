
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestRoute, type SuggestRouteOutput } from "@/ai/flows/suggest-route";
import { calculateFuel, type CalculateFuelInput, type CalculateFuelOutput } from "@/ai/flows/calculate-fuel";
import { useToast } from "@/hooks/use-toast";
import { Map, APIProvider, Marker, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { getOrders } from "@/lib/data-service";
import { type Order } from "@/lib/types";


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, Sparkles, Clock, Lightbulb, LocateFixed, Warehouse, Package, Fuel } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  currentLocation: z.string().min(1, "Current location is required."),
  destination: z.string().min(1, "Destination is required."),
  trafficData: z.string().min(1, "Traffic data is required."),
  vehicleType: z.string().min(1, "Please select a vehicle type."),
});

type FormValues = z.infer<typeof formSchema>;

type LatLngLiteral = google.maps.LatLngLiteral;

function Directions({ origin, destination }: { origin?: LatLngLiteral; destination?: LatLngLiteral }) {
    const map = useMap();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

    useEffect(() => {
        if (!map) return;
        setDirectionsRenderer(new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true, // We use our own markers
            polylineOptions: {
                strokeColor: '#1a73e8',
                strokeOpacity: 0.8,
                strokeWeight: 6,
            },
        }));
    }, [map]);

    useEffect(() => {
        if (!directionsRenderer || !origin || !destination) {
            // Clear previous routes if any
            if(directionsRenderer) {
                directionsRenderer.setDirections({routes: []});
            }
            return;
        }

        const directionsService = new google.maps.DirectionsService();

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
            } else {
                console.error(`Directions request failed due to ${status}`);
            }
        });

        return () => {
            if (directionsRenderer) {
                directionsRenderer.setDirections({routes: []});
            }
        };

    }, [directionsRenderer, origin, destination]);

    return null;
}

function RouteMap({ origin, destination }: { origin?: LatLngLiteral, destination?: LatLngLiteral }) {
    const [activeMarker, setActiveMarker] = useState<'origin' | 'destination' | null>(null);

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return <div className="flex items-center justify-center h-full bg-muted rounded-t-lg"><p>Google Maps API Key not configured.</p></div>
    }

    const defaultCenter = { lat: 7.9465, lng: -1.0232 }; // Default to Ghana

    return (
        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={origin || defaultCenter}
                    defaultZoom={8}
                    mapId="route-optimizer-map"
                    gestureHandling={'greedy'}
                    key={JSON.stringify(origin) + JSON.stringify(destination)} // Force re-render on prop change
                >
                    {origin && <Marker position={origin} onClick={() => setActiveMarker('origin')} >
                         <div className="bg-background p-2 rounded-full shadow-md border-2 border-red-500">
                            <Warehouse className="w-5 h-5 text-red-600" />
                        </div>
                    </Marker>}
                    {activeMarker === 'origin' && origin && (
                        <InfoWindow position={origin} onCloseClick={() => setActiveMarker(null)}>
                            <p className="font-semibold p-1">Origin</p>
                        </InfoWindow>
                    )}

                    {destination && <Marker position={destination} onClick={() => setActiveMarker('destination')}>
                        <div className="bg-background p-2 rounded-full shadow-md border-2 border-green-500">
                            <Package className="w-5 h-5 text-green-600" />
                        </div>
                    </Marker>}
                    {activeMarker === 'destination' && destination && (
                        <InfoWindow position={destination} onCloseClick={() => setActiveMarker(null)}>
                             <p className="font-semibold p-1">Destination</p>
                        </InfoWindow>
                    )}
                    
                    <Directions origin={origin} destination={destination} />
                </Map>
            </APIProvider>
        </div>
    )
}

export function RouteOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestRouteOutput | null>(null);
  const [fuelResult, setFuelResult] = useState<CalculateFuelOutput | null>(null);
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [routeCoords, setRouteCoords] = useState<{origin?: LatLngLiteral, destination?: LatLngLiteral}>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: "",
      destination: "",
      trafficData: "Heavy traffic on N1 highway near Tema, moderate traffic in Adenta.",
      vehicleType: "Standard Cargo Van",
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
        const liveOrders = await getOrders();
        setOrders(liveOrders);
        const firstOrder = liveOrders[0];
        if (firstOrder) {
            form.setValue("currentLocation", firstOrder.pickup.address);
            form.setValue("destination", firstOrder.destination.address);
            setRouteCoords({
                origin: firstOrder.pickup.coords,
                destination: firstOrder.destination.coords,
            });
        }
    };
    fetchInitialData();
  }, [form]);


  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // A real app would use a geocoding service to convert these coords to an address.
          // For this demo, we'll just set the lat/lng string and update the map.
          const locationString = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          form.setValue("currentLocation", locationString);
          setRouteCoords(prev => ({ ...prev, origin: { lat: latitude, lng: longitude } }));
          toast({
            title: "Location Fetched",
            description: "Your current location has been set.",
          })
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch your location. Please ensure you have granted permission.",
          });
        }
      );
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Geolocation is not supported by your browser.",
      });
    }
  };


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    setFuelResult(null);

    try {
      const suggestion = await suggestRoute(data);
      setResult(suggestion);
      
      if (suggestion.estimatedTravelTime) {
        const distanceMatch = suggestion.optimizedRoute.match(/(\d+(\.\d+)?)\s*km/);
        const distance = distanceMatch ? `${distanceMatch[1]} km` : "150 km"; 

        const fuelInput: CalculateFuelInput = {
            distance: distance,
            vehicleType: data.vehicleType,
        };
        const fuelSuggestion = await calculateFuel(fuelInput);
        setFuelResult(fuelSuggestion);
      }

    } catch (error) {
      console.error("Failed to get route suggestion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate a route. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update map if form values change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
        if (name === 'currentLocation' || name === 'destination') {
            const originOrder = orders.find(o => o.pickup.address === value.currentLocation);
            const destinationOrder = orders.find(o => o.destination.address === value.destination);
            
            const newCoords: {origin?: LatLngLiteral, destination?: LatLngLiteral} = {};
            if(originOrder) newCoords.origin = originOrder.pickup.coords;
            else if (name === 'currentLocation') newCoords.origin = undefined;

            if(destinationOrder) newCoords.destination = destinationOrder.destination.coords;
            else if (name === 'destination') newCoords.destination = undefined;
            
            setRouteCoords(prev => ({...prev, ...newCoords}));
        }
    });
    return () => subscription.unsubscribe();
  }, [form, orders]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="shadow-sm lg:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Sparkles className="text-primary" /> Route AI
              </CardTitle>
              <CardDescription>
                Enter details to get an AI-optimized route and fuel estimate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Current Location</FormLabel>
                       <Button variant="ghost" size="sm" type="button" onClick={handleGetCurrentLocation} className="gap-1 text-xs">
                          <LocateFixed className="w-3 h-3"/>
                          Use My Location
                       </Button>
                    </div>
                    <FormControl>
                      <Input placeholder="e.g., Adum, Kumasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Takoradi Market Circle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Motorbike">Motorbike</SelectItem>
                          <SelectItem value="Standard Cargo Van">Standard Cargo Van</SelectItem>
                          <SelectItem value="Heavy Duty Truck">Heavy Duty Truck</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="trafficData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Real-time Traffic Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe current traffic conditions..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Generate Route"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="shadow-sm lg:col-span-2 sticky top-24">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Suggested Route
          </CardTitle>
          <CardDescription>
            Your AI-optimized route and fuel estimate will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[450px] flex flex-col items-center justify-center p-0">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p>Optimizing route...</p>
            </div>
          ) : result ? (
            <div className="w-full h-full flex flex-col">
              <RouteMap origin={routeCoords.origin} destination={routeCoords.destination} />
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary"/>
                        <div>
                            <h3 className="font-semibold">Est. Travel Time</h3>
                            <p className="text-muted-foreground">{result.estimatedTravelTime}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-primary mt-0.5"/>
                        <div>
                            <h3 className="font-semibold">Reasoning</h3>
                            <p className="text-muted-foreground">{result.reasoning}</p>
                        </div>
                    </div>
                </div>
                 {fuelResult && (
                    <>
                    <Separator />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <Fuel className="w-5 h-5 text-primary"/>
                            <div>
                                <h3 className="font-semibold">Est. Fuel Consumption</h3>
                                <p className="text-muted-foreground">{fuelResult.fuelConsumedLiters.toFixed(2)} Liters ({fuelResult.estimatedCost})</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-primary mt-0.5"/>
                            <div>
                                <h3 className="font-semibold">Fuel Calculation</h3>
                                <p className="text-muted-foreground">{fuelResult.reasoning}</p>
                            </div>
                        </div>
                    </div>
                    </>
                )}
                <Separator />
                 <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-5 h-5 text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>Turn-by-turn Directions</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{result.optimizedRoute}</p>
                </div>
              </div>
            </div>
          ) : (
             <div className="w-full h-full flex flex-col">
                 <RouteMap origin={routeCoords.origin} destination={routeCoords.destination} />
                  <div className="p-6 text-center text-muted-foreground">
                    <p>Submit the form to generate your route.</p>
                  </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
