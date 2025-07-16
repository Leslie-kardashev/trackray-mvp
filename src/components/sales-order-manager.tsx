
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getCustomers, getOrders, addOrder } from "@/lib/data-service";
import { type Customer, type Order } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

const orderSchema = z.object({
  customerId: z.string({ required_error: "Please select a customer." }),
  item: z.string().min(3, "Item description is required."),
  orderValue: z.coerce.number().min(1, "Order value must be positive."),
  paymentStatus: z.enum(["Pending", "Paid"]),
  deliveryTime: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

function CreateOrderForm({ customers, onOrderCreated, closeDialog }: { customers: Customer[], onOrderCreated: () => void; closeDialog: () => void }) {
  const { toast } = useToast();
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { item: "", specialInstructions: "" },
  });

  async function onSubmit(values: OrderFormValues) {
    try {
      const customer = customers.find(c => c.id === values.customerId);
      if (!customer) throw new Error("Selected customer not found.");

      await addOrder({
        customerId: values.customerId,
        customerName: customer.name,
        destination: customer.location,
        item: values.item,
        paymentStatus: values.paymentStatus,
        orderValue: values.orderValue,
        deliveryTime: values.deliveryTime,
        specialInstructions: values.specialInstructions
      });
      toast({ title: "Success", description: "New order has been created." });
      onOrderCreated();
      form.reset();
      closeDialog();
    } catch (error) {
        console.log(error);
      toast({ variant: "destructive", title: "Error", description: "Could not create order." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="customerId" render={({ field }) => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger></FormControl>
              <SelectContent>
                {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.id})</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="item" render={({ field }) => (
          <FormItem>
            <FormLabel>Item Description</FormLabel>
            <FormControl><Input placeholder="e.g., 50 boxes of Grade A Cocoa Beans" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="orderValue" render={({ field }) => (
                <FormItem>
                    <FormLabel>Order Value (GHS)</FormLabel>
                    <FormControl><Input type="number" placeholder="500.00" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="paymentStatus" render={({ field }) => (
                <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <FormField control={form.control} name="deliveryTime" render={({ field }) => (
            <FormItem>
                <FormLabel>Preferred Delivery Time (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Morning, 9am-12pm" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="specialInstructions" render={({ field }) => (
            <FormItem>
                <FormLabel>Special Instructions (Optional)</FormLabel>
                <FormControl><Textarea placeholder="Call upon arrival." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
          <Button type="submit">Create Order</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const statusStyles: { [key in Order['status']]: string } = {
    'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function SalesOrderManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [ordersData, customersData] = await Promise.all([getOrders(), getCustomers()]);
            setOrders(ordersData);
            setCustomers(customersData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Orders</CardTitle>
                <CardDescription>Create new orders for customers and track their status.</CardDescription>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2" />Create New Order</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>Fill in the details for a new customer delivery.</DialogDescription>
                </DialogHeader>
                <CreateOrderForm customers={customers} onOrderCreated={fetchData} closeDialog={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
         <ScrollArea className="h-[400px]">
            <Table>
                <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {isLoading ? (
                        Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono">{order.id}</TableCell>
                                <TableCell className="font-medium">{order.customerName}</TableCell>
                                <TableCell>{order.item}</TableCell>
                                <TableCell>{order.destination.address}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("border-0", statusStyles[order.status])}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
