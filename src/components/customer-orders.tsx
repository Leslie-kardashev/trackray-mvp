"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockOrders } from "@/lib/mock-data";
import { type Order } from "@/lib/types";
import { cn } from "@/lib/utils";

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

export function CustomerOrders() {
  return (
    <Card className="shadow-sm">
      <Tabs defaultValue="history">
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
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.item}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("border", statusStyles[order.status])}>
                            {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{order.destination}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </TabsContent>
        <TabsContent value="new">
            <NewOrderForm />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
