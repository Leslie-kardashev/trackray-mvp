
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getOrders, addOrder } from "@/lib/data-service";
import { type Order, type Location } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Map, Marker, APIProvider, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { Truck, Warehouse, Package, LocateFixed, FileText } from "lucide-react";

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
import { Skeleton } from "./ui/skeleton";
import { InvoiceDialog } from "./invoice-dialog";

const newOrderSchema = z.object({
  itemDescription: z.string().min(3, "Item description must be at least 3 characters."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  pickupAddress: z.string().min(1, "Please set a pickup address on the map."),
  deliveryAddress: z.string().min(1, "Please set a delivery address on the map."),
  paymentMethod: z.enum(["Pay on Credit", "Paid"], {
    required_error: "You need to select a payment method.",
  }),
});

type NewOrderValues = z.infer<typeof newOrderSchema>;
type LatLngLiteral = google.maps.LatLngLiteral;

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Ready for Pickup': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};

function NewOrderForm({ onOrderSubmitted }: { onOrderSubmitted: () => void }) {
    const { toast } = useToast();
    const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
    const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const form = useForm<NewOrderValues>({
        resolver: zodResolver(newOrderSchema),
        defaultValues: {
            itemDescription: "",
            pickupAddress: "",
            deliveryAddress: "",
            quantity: 1,
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
                    const address = results[0].formatted_address;
                    form.setValue(field, address, { shouldValidate: true });
                    if (field === "pickupAddress") {
                        setPickupLocation({ address, coords: latlng });
                    } else {
                        setDeliveryLocation({ address, coords: latlng });
                    }
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
        if (!pickupLocation) {
            geocodeLatLng(latLng, "pickupAddress");
        } else if (!deliveryLocation) {
            geocodeLatLng(latLng, "deliveryAddress");
        } else {
            toast({
                title: "Locations Set",
                description: "To change locations, please reset them first.",
            });
        }
    };
    
    const handleResetLocations = () => {
        setPickupLocation(null);
        setDeliveryLocation(null);
        form.setValue("pickupAddress", "");
        form.setValue("deliveryAddress", "");
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const latLng = { lat: latitude, lng: longitude };
                    geocodeLatLng(latLng, "pickupAddress");
                    toast({
                        title: "Location Fetched",
                        description: "Your current location has been set as the pickup address.",
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Could not fetch your location. Please grant permission.",
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

    async function onSubmit(values: NewOrderValues) {
        if (!pickupLocation || !deliveryLocation) {
            toast({ variant: "destructive", title: "Missing Locations", description: "Please set both pickup and delivery locations on the map." });
            return;
        }

        try {
            await addOrder({
                customerName: "Customer 123", // Placeholder
                item: values.itemDescription,
                pickup: pickupLocation,
                destination: deliveryLocation,
                paymentStatus: values.paymentMethod,
                currentLocation: null, // Starts with no truck assigned
                routeColor: '#FF5733', // Default color
            });
            toast({
                title: "Order Submitted!",
                description: "Your new order has been created successfully.",
            });
            form.reset();
            handleResetLocations();
            onOrderSubmitted(); // Callback to refresh the history tab
        } catch (error) {
            console.error("Failed to submit order:", error);
            toast({ variant: "destructive", title: "Submission Error", description: "Could not submit your order." });
        }
    }

    const MapArea = () => {
       if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return (
                 <div className="flex items-center justify-center h-full w-full bg-muted rounded-b-lg">
                    <p className="text-center text-muted-foreground p-4">
                        Google Maps API Key is missing or invalid.
                        <br />
                        Please add it to the <code className="font-mono bg-muted-foreground/20 p-1 rounded">.env</code> file.
                    </p>
                </div>
            )
        }
        return (
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={{ lat: 7.9465, lng: -1.0232 }}
                    defaultZoom={7}
                    gestureHandling={'greedy'}
                    onClick={handleMapClick}
                    className="h-full w-full"
                >
                    {pickupLocation && (
                        <Marker position={pickupLocation.coords}>
                            <div className="bg-background p-2 rounded-full shadow-md border-2 border-primary">
                                <Warehouse className="w-5 h-5 text-primary" />
                            </div>
                        </Marker>
                    )}
                     {deliveryLocation && (
                        <Marker position={deliveryLocation.coords}>
                            <div className="bg-background p-2 rounded-full shadow-md border-2 border-green-500">
                                <Package className="w-5 h-5 text-green-600" />
                            </div>
                        </Marker>
                    )}
                </Map>
            </APIProvider>
        )
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
                                              <RadioGroupItem value="Pay on Credit" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              Pay on Credit
                                            </FormLabel>
                                          </FormItem>
                                          <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <RadioGroupItem value="Paid" />
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
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation} className="gap-1.5"><LocateFixed className="w-4 h-4" /> Use My Location</Button>
                                        <Button type="button" variant="outline" size="sm" onClick={handleResetLocations}>Reset</Button>
                                    </div>
                                </div>
                                <CardDescription>
                                    Click on the map to set a {!pickupLocation ? 'Pickup' : 'Delivery'} location.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px] w-full p-0 rounded-b-lg overflow-hidden">
                                <MapArea />
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
    
    // Only draw a route for active trucks.
    if (!['Moving', 'Idle', 'Returning'].includes(order.status) || !order.currentLocation) {
        if(directionsRenderer) directionsRenderer.setDirections({routes: []});
        return;
    };
    
    const origin = order.currentLocation;
    const destination = order.status === 'Returning' ? order.pickup.coords : order.destination.coords;
    
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else if (status !== google.maps.DirectionsStatus.ZERO_RESULTS) {
        // We expect ZERO_RESULTS sometimes, so don't log it as an error.
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
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return <div className="flex items-center justify-center h-full bg-muted rounded-lg"><p className="text-center text-muted-foreground p-4">Could not load map. <br/> API Key is missing or invalid.</p></div>
    }

    const center = order.currentLocation || order.destination.coords;
    
    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={center}
                defaultZoom={10}
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

                {['Moving', 'Idle', 'Returning'].includes(order.status) && order.currentLocation && (
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("history");
    const [invoiceOrderId, setInvoiceOrderId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            if (activeTab === 'history') setIsLoading(true);
            const fetchedOrders = await getOrders();
            // Assuming customer ID 'CUS-101' for this demo
            const customerOrders = fetchedOrders.filter(o => o.customerId === 'CUS-101');
            setOrders(customerOrders);
            // If no order is selected, or the selected one is gone, select the first one.
            if (!selectedOrder || !customerOrders.find(o => o.id === selectedOrder.id)) {
                 setSelectedOrder(customerOrders.find(o => ['Moving', 'Idle', 'Returning'].includes(o.status)) || customerOrders[0] || null);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedOrder, activeTab]);

    useEffect(() => {
        fetchOrders();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders]);
    
    const handleOrderSubmitted = () => {
        fetchOrders();
        setActiveTab("history"); // Switch to history tab after submitting
    };

  return (
    <>
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-2xl">Create & Track</CardTitle>
              <CardDescription>
                Submit a new order or view your delivery history.
              </CardDescription>
            </div>
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
                                    <TableHead>Action</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer" data-state={selectedOrder?.id === order.id ? 'selected' : 'unselected'}>
                                            <TableCell className="font-mono">{order.id}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[order.status])}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                 <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setInvoiceOrderId(order.id); }}>
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
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
                            <p className="text-muted-foreground">Select an order to see details or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
        <TabsContent value="new">
            <NewOrderForm onOrderSubmitted={handleOrderSubmitted} />
        </TabsContent>
    </Card>
    </Tabs>
    {invoiceOrderId && (
        <InvoiceDialog
            orderId={invoiceOrderId}
            open={!!invoiceOrderId}
            onOpenChange={(open) => {
                if (!open) {
                    setInvoiceOrderId(null);
                }
            }}
        />
     )}
    </>
  );
}

    
