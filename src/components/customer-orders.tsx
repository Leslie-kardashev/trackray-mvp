"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockOrders } from "@/lib/mock-data";
import { type Order } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Map, Marker, APIProvider, Polyline } from "@vis.gl/react-google-maps";
import { Truck } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
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

const newOrderSchema = z.object({
  itemDescription: z.string().min(1, "Item description is required."),
  pickupAddress: z.string().min(1, "Pickup address is required."),
  deliveryAddress: z.string().min(1, "Delivery address is required."),
});

type NewOrderValues = z.infer<typeof newOrderSchema>;

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};


function NewOrderForm() {
    const form = useForm<NewOrderValues>({
        resolver: zodResolver(newOrderSchema),
        defaultValues: {
            itemDescription: "",
            pickupAddress: "",
            deliveryAddress: ""
        }
    });

    function onSubmit(values: NewOrderValues) {
        // In a real app, this would submit the order to the backend.
        console.log(values);
        alert("Order submitted successfully! (Check console for data)");
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CardContent className="space-y-4 pt-6">
                    <FormField
                        control={form.control}
                        name="itemDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g., 2 pallets of electronics" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pickupAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 123 Industrial Way" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deliveryAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 456 Commerce St" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit">Submit Order</Button>
                </CardFooter>
            </form>
        </Form>
    );
}

function CustomerMap({ order }: { order: Order }) {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return <div className="flex items-center justify-center h-full bg-muted rounded-lg"><p>Google Maps API Key not configured.</p></div>
    }

    const center = order.currentLocation || order.pickup.coords;
    const route = [order.pickup.coords, order.currentLocation, order.destination.coords].filter(Boolean) as google.maps.LatLngLiteral[];

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                defaultCenter={center}
                defaultZoom={10}
                mapId="customer-map"
                className="h-full w-full rounded-lg"
            >
                <Marker position={order.pickup.coords} label="A" title={order.pickup.address} />
                <Marker position={order.destination.coords} label="B" title={order.destination.address} />
                {order.status === 'In Transit' && order.currentLocation && (
                    <Marker position={order.currentLocation} title="Current Location">
                         <div className="bg-primary p-2 rounded-full shadow-lg">
                            <Truck className="w-5 h-5 text-primary-foreground" />
                        </div>
                    </Marker>
                )}
                <Polyline path={route} options={{ strokeColor: '#0000FF', strokeWeight: 3 }} />
            </Map>
        </APIProvider>
    )
}

export function CustomerOrders() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(mockOrders[1]);
  return (
    <Tabs defaultValue="history">
    <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Orders</CardTitle>
          <div className="flex justify-between items-end">
          <CardDescription>
            Submit a new order or view your past deliveries.
          </CardDescription>
          <TabsList>
            <TabsTrigger value="history">Order History</TabsTrigger>
            <TabsTrigger value="new">New Order</TabsTrigger>
          </TabsList>
          </div>
        </CardHeader>
        <TabsContent value="history">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 pt-0">
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
                                    <TableRow key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
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
                                <CardDescription>{selectedOrder.item} going to {selectedOrder.destination.address}</CardDescription>
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
