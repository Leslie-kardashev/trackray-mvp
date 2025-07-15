"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestRoute, type SuggestRouteOutput } from "@/ai/flows/suggest-route";
import { useToast } from "@/hooks/use-toast";
import { Map, APIProvider, Marker, useMap } from "@vis.gl/react-google-maps";
import { mockOrders } from "@/lib/mock-data";


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
import { Loader, Sparkles, MapPin, Clock, Lightbulb, LocateFixed } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  currentLocation: z.string().min(1, "Current location is required."),
  destination: z.string().min(1, "Destination is required."),
  trafficData: z.string().min(1, "Traffic data is required."),
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
            directionsRenderer.setDirections({routes: []});
        };

    }, [directionsRenderer, origin, destination]);

    return null;
}

function RouteMap({ origin, destination }: { origin?: LatLngLiteral, destination?: LatLngLiteral }) {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return <div className="flex items-center justify-center h-full bg-muted rounded-t-lg"><p>Google Maps API Key not configured.</p></div>
    }

    const defaultCenter = { lat: 7.9465, lng: -1.0232 }; // Default to Ghana

    return (
        <div className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={origin || defaultCenter}
                    defaultZoom={8}
                    mapId="route-optimizer-map"
                    gestureHandling={'greedy'}
                    key={JSON.stringify(origin) + JSON.stringify(destination)} // Force re-render on prop change
                >
                    {origin && <Marker position={origin} title="Origin" >
                         <div className="bg-background p-1.5 rounded-full shadow-md">
                            <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                    </Marker>}
                    {destination && <Marker position={destination} title="Destination">
                        <div className="bg-background p-1.5 rounded-full shadow-md">
                            <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                    </Marker>}
                    <Directions origin={origin} destination={destination} />
                </Map>
            </APIProvider>
        </div>
    )
}

export function RouteOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestRouteOutput | null>(null);
  const { toast } = useToast();
  
  const [routeCoords, setRouteCoords] = useState<{origin?: LatLngLiteral, destination?: LatLngLiteral}>({
      origin: mockOrders[1].pickup.coords,
      destination: mockOrders[1].destination.coords
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: mockOrders[1].pickup.address,
      destination: mockOrders[1].destination.address,
      trafficData: "Heavy traffic on N1 highway near Tema, moderate traffic in Adenta.",
    },
  });

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          form.setValue("currentLocation", locationString);
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
    try {
      const suggestion = await suggestRoute(data);
      // This is a mock implementation. A real app would geocode addresses from the suggestion
      // to get coordinates for the map. We'll keep using mock data for the map for now.
      setRouteCoords({
          origin: mockOrders[1].pickup.coords, // Replace with geocoded origin from `data`
          destination: mockOrders[1].destination.coords // Replace with geocoded destination from `data`
      });
      setResult(suggestion);
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
                Enter details to get an AI-optimized route in Ghana.
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

      <Card className="shadow-sm lg:col-span-2 sticky top-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Suggested Route
          </CardTitle>
          <CardDescription>
            Your AI-optimized route will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[450px] flex flex-col items-center justify-center p-0">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p>Optimizing route...</p>
            </div>
          ) : result ? (
            <div className="w-full h-full flex flex-col">
              <RouteMap origin={routeCoords.origin} destination={routeCoords.destination} />
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
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
                <Separator />
                 <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/>Turn-by-turn Directions</h3>
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
