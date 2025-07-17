
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getCustomers, getOrders, addOrder, getDrivers, assignDriver } from "@/lib/data-service";
import { type Customer, type Order, type Driver } from "@/lib/types";

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
import { PlusCircle, UserPlus } from "lucide-react";
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

const assignDriverSchema = z.object({
    driverId: z.string({ required_error: "Please select a driver." }),
});


function AssignDriverDialog({ order, drivers, onAssign, onOpenChange }: { order: Order; drivers: Driver[]; onAssign: () => void; onOpenChange: (open: boolean) => void; }) {
    const { toast } = useToast();
    const { control, handleSubmit, formState: { isSubmitting } } = useForm({
        resolver: zodResolver(assignDriverSchema)
    });

    const onSubmit = async (data: { driverId: string }) => {
        try {
            await assignDriver(order.id, data.driverId);
            toast({ title: "Driver Assigned", description: `Driver has been assigned to order ${order.id}.` });
            onAssign();
            onOpenChange(false);
        } catch (error) {
            toast({ variant: "destructive", title: "Assignment Failed", description: "Could not assign driver to the order." });
        }
    };
    
    const availableDrivers = drivers.filter(d => d.status === 'Available');

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Driver to Order {order.id}</DialogTitle>
          <DialogDescription>Select an available driver from the list below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            {availableDrivers.length > 0 ? (
                <div className="py-4">
                     <Controller
                        name="driverId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an available driver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDrivers.map(driver => (
                                        <SelectItem key={driver.id} value={driver.id}>
                                            {driver.name} ({driver.vehicleType})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            ) : (
                <p className="py-4 text-muted-foreground">No drivers are currently available.</p>
            )}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting || availableDrivers.length === 0}>
                    {isSubmitting ? "Assigning..." : "Assign Driver"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    )
}


function CreateOrderForm({ customers, onOrderCreated, closeDialog }: { customers: Customer[], onOrderCreated: () => void; closeDialog: () => void }) {
  const { toast } = useToast();
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
        customerId: "",
        item: "",
        orderValue: 0,
        paymentStatus: "Pending",
        deliveryTime: "",
        specialInstructions: "",
    },
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
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
    const [isAssignDriverDialogOpen, setAssignDriverDialogOpen] = useState(false);
    const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState<Order | null>(null);


    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [ordersData, customersData, driversData] = await Promise.all([getOrders(), getCustomers(), getDrivers()]);
            setOrders(ordersData);
            setCustomers(customersData);
            setDrivers(driversData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssignDriverClick = (order: Order) => {
        setSelectedOrderForAssignment(order);
        setAssignDriverDialogOpen(true);
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Orders</CardTitle>
                <CardDescription>Create new orders for customers and track their status.</CardDescription>
            </div>
             <Dialog open={isCreateOrderDialogOpen} onOpenChange={setCreateOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2" />Create New Order</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>Fill in the details for a new customer delivery.</DialogDescription>
                </DialogHeader>
                <CreateOrderForm customers={customers} onOrderCreated={fetchData} closeDialog={() => setCreateOrderDialogOpen(false)} />
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
                        <TableHead>Assigned Driver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {isLoading ? (
                        Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono">{order.id}</TableCell>
                                <TableCell className="font-medium">{order.customerName}</TableCell>
                                <TableCell>{order.item}</TableCell>
                                <TableCell>{order.driverName || "N/A"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("border-0", statusStyles[order.status])}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {order.status === 'Pending' && (
                                        <Button variant="outline" size="sm" onClick={() => handleAssignDriverClick(order)}>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Assign Driver
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </ScrollArea>

         {selectedOrderForAssignment && (
            <Dialog open={isAssignDriverDialogOpen} onOpenChange={setAssignDriverDialogOpen}>
                <AssignDriverDialog 
                    order={selectedOrderForAssignment} 
                    drivers={drivers}
                    onAssign={fetchData}
                    onOpenChange={setAssignDriverDialogOpen}
                />
            </Dialog>
        )}

      </CardContent>
    </Card>
  );
}
