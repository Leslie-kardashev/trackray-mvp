
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockOrders } from "@/lib/mock-data";
import { type Order } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Map, Marker, APIProvider, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { Truck, Warehouse, Package, Pin } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

const newOrderSchema = z.object({
  itemDescription: z.string().min(3, "Item description must be at least 3 characters."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  weight: z.coerce.number().min(0, "Weight cannot be negative.").optional(),
  pickupAddress: z.string().min(1, "Please set a pickup address on the map."),
  deliveryAddress: z.string().min(1, "Please set a delivery address on the map."),
  paymentMethod: z.enum(["pod", "momo"], {
    required_error: "You need to select a payment method.",
  }),
});

type NewOrderValues = z.infer<typeof newOrderSchema>;
type LatLngLiteral = google.maps.LatLngLiteral;

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

function NewOrderForm() {
    const { toast } = useToast();
    const [pickupCoords, setPickupCoords] = useState<LatLngLiteral | null>(null);
    const [deliveryCoords, setDeliveryCoords] = useState<LatLngLiteral | null>(null);

    const form = useForm<NewOrderValues>({
        resolver: zodResolver(newOrderSchema),
        defaultValues: {
            itemDescription: "",
            pickupAddress: "",
            deliveryAddress: "",
            quantity: 1,
            weight: 0,
        }
    });
    
    const geocodeLatLng = useCallback((latlng: LatLngLiteral, field: "pickupAddress" | "deliveryAddress") => {
        if (!window.google || !window.google.maps) {
            toast({ variant: "destructive", title: "Map Error", description: "Google Maps script not loaded." });
            return;
        }
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                if (results?.[0]) {
                    form.setValue(field, results[0].formatted_address, { shouldValidate: true });
                } else {
                    toast({ variant: "destructive", title: "Geocoding Error", description: "No results found for the selected location." });
                }
            } else {
                toast({ variant: "destructive", title: "Geocoding Error", description: `Geocoder failed due to: ${status}` });
            }
        });
    }, [form, toast]);


    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const latLng = e.latLng.toJSON();
        if (!pickupCoords) {
            setPickupCoords(latLng);
            geocodeLatLng(latLng, "pickupAddress");
        } else if (!deliveryCoords) {
            setDeliveryCoords(latLng);
            geocodeLatLng(latLng, "deliveryAddress");
        } else {
            toast({
                title: "Locations Set",
                description: "To change locations, please reset them first.",
            });
        }
    };
    
    const handleResetLocations = () => {
        setPickupCoords(null);
        setDeliveryCoords(null);
        form.setValue("pickupAddress", "");
        form.setValue("deliveryAddress", "");
    };

    function onSubmit(values: NewOrderValues) {
        // In a real app, this would submit the order to the backend.
        console.log({ ...values, pickupCoords, deliveryCoords });
        toast({
            title: "Order Submitted!",
            description: "Your new order has been created successfully.",
        });
        form.reset();
        handleResetLocations();
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return <div className="p-6"><p>Google Maps API Key not configured for ordering.</p></div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 pt-2">
                    {/* Form Fields - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">1. Order Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="itemDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Item Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., 20 boxes of Grade A Cocoa Beans" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 20" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Total Weight (kg)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 500" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">2. Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                  control={form.control}
                                  name="paymentMethod"
                                  render={({ field }) => (
                                    <FormItem className="space-y-3">
                                      <FormControl>
                                        <RadioGroup
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          className="flex flex-col space-y-1"
                                        >
                                          <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <RadioGroupItem value="pod" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              Pay on Delivery
                                            </FormLabel>
                                          </FormItem>
                                          <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <RadioGroupItem value="momo" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              Pay Now with Mobile Money
                                            </FormLabel>
                                          </FormItem>
                                        </RadioGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Map - Right Column */}
                    <div className="lg:col-span-3">
                        <Card className="h-full">
                           <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl">3. Set Locations</CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={handleResetLocations}>Reset</Button>
                                </div>
                                <CardDescription>
                                    Click on the map to set a {!pickupCoords ? 'Pickup' : 'Delivery'} location.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px] w-full p-0 rounded-b-lg overflow-hidden">
                                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                                    <Map
                                        defaultCenter={{ lat: 7.9465, lng: -1.0232 }}
                                        defaultZoom={7}
                                        mapId="new-order-map"
                                        gestureHandling={'greedy'}
                                        onClick={handleMapClick}
                                        className="h-full w-full"
                                    >
                                        {pickupCoords && (
                                            <Marker position={pickupCoords}>
                                                <div className="bg-background p-2 rounded-full shadow-md border-2 border-primary">
                                                    <Warehouse className="w-5 h-5 text-primary" />
                                                </div>
                                            </Marker>
                                        )}
                                         {deliveryCoords && (
                                            <Marker position={deliveryCoords}>
                                                <div className="bg-background p-2 rounded-full shadow-md border-2 border-green-500">
                                                    <Package className="w-5 h-5 text-green-600" />
                                                </div>
                                            </Marker>
                                        )}
                                    </Map>
                                </APIProvider>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Separator />
                <CardFooter className="p-6">
                    <Button type="submit" size="lg" className="w-full font-bold">Submit Order</Button>
                </CardFooter>
            </form>
        </Form>
    );
}

function Directions({ order }: { order: Order }) {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsRenderer(new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1a73e8',
        strokeOpacity: 0.8,
        strokeWeight: 6,
      },
    }));
  }, [map]);

  useEffect(() => {
    if (!directionsRenderer || !order) return;

    const directionsService = new google.maps.DirectionsService();
    
    const origin = (order.status === 'Moving' && order.currentLocation) ? order.currentLocation : order.pickup.coords;
    
    directionsService.route({
      origin: origin,
      destination: order.destination.coords,
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
  }, [directionsRenderer, order]);

  return null;
}

function CustomerMap({ order }: { order: Order }) {
    const [activeMarker, setActiveMarker] = useState<string | null>(null);

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return <div className="flex items-center justify-center h-full bg-muted rounded-lg"><p>Google Maps API Key not configured.</p></div>
    }

    const center = order.currentLocation || order.pickup.coords;
    
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                defaultCenter={center}
                defaultZoom={10}
                mapId="customer-map"
                className="h-full w-full rounded-lg"
                gestureHandling={'greedy'}
            >
                <Marker position={order.pickup.coords} onClick={() => setActiveMarker('origin')}>
                    <div className="bg-background p-2 rounded-full shadow-md border-2 border-red-500">
                        <Warehouse className="w-5 h-5 text-red-600" />
                    </div>
                </Marker>
                 {activeMarker === 'origin' && (
                    <InfoWindow position={order.pickup.coords} onCloseClick={() => setActiveMarker(null)}>
                        <p className="font-semibold p-1">Pickup Location</p>
                    </InfoWindow>
                )}


                <Marker position={order.destination.coords} onClick={() => setActiveMarker('destination')}>
                    <div className="bg-background p-2 rounded-full shadow-md border-2 border-green-500">
                        <Package className="w-5 h-5 text-green-600" />
                    </div>
                </Marker>
                {activeMarker === 'destination' && (
                    <InfoWindow position={order.destination.coords} onCloseClick={() => setActiveMarker(null)}>
                        <p className="font-semibold p-1">Delivery Location</p>
                    </InfoWindow>
                )}

                {order.status === 'Moving' && order.currentLocation && (
                    <Marker position={order.currentLocation} onClick={() => setActiveMarker('truck')}>
                         <div className="bg-primary p-2 rounded-full shadow-lg">
                            <Truck className="w-5 h-5 text-primary-foreground" />
                        </div>
                    </Marker>
                )}
                {activeMarker === 'truck' && order.currentLocation && (
                    <InfoWindow position={order.currentLocation} onCloseClick={() => setActiveMarker(null)}>
                        <p className="font-semibold p-1">Your Delivery</p>
                    </InfoWindow>
                )}

                <Directions order={order} />
            </Map>
        </APIProvider>
    )
}

export function CustomerOrders() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(mockOrders.find(o => o.status === 'Moving') || mockOrders[0]);
  return (
    <Tabs defaultValue="new">
    <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Orders</CardTitle>
          <div className="flex justify-between items-end">
          <CardDescription>
            Submit a new order or view your delivery history.
          </CardDescription>
          <TabsList>
            <TabsTrigger value="new">Create New Order</TabsTrigger>
            <TabsTrigger value="history">Order History & Tracking</TabsTrigger>
          </TabsList>
          </div>
        </CardHeader>
        <TabsContent value="history">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 pt-2">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">History</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {mockOrders.map((order) => (
                                    <TableRow key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer" data-state={selectedOrder?.id === order.id ? 'selected' : 'unselected'}>
                                        <TableCell className="font-mono">{order.id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[order.status])}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.orderDate}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 min-h-[400px]">
                    {selectedOrder ? (
                         <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-xl">Tracking Details for {selectedOrder.id}</CardTitle>
                                <CardDescription>{selectedOrder.item} from {selectedOrder.pickup.address} to {selectedOrder.destination.address}</CardDescription>
                            </CardHeader>
                             <CardContent className="h-[400px] p-0">
                                <CustomerMap order={selectedOrder} />
                             </CardContent>
                         </Card>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                            <p className="text-muted-foreground">Select an order to see details</p>
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
        <TabsContent value="new">
            <NewOrderForm />
        </TabsContent>
    </Card>
    </Tabs>
  );
}
