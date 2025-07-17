
"use client";

import { useState, useEffect } from "react";
import { getOrders, getCustomers, getDrivers, assignDriver } from "@/lib/data-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type Order, type Customer, type Driver } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Truck, MoreHorizontal, Package, User, Phone, MapPin, Calendar, DollarSign, UserPlus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const paymentStatusStyles: { [key in Order['paymentStatus']]: string } = {
    'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Pay on Credit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

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

const OrderDetailsDialog = ({ order, customer }: { order: Order; customer: Customer | undefined }) => {
    return (
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details <span className="font-mono text-primary">{order.id}</span>
          </DialogTitle>
          <DialogDescription>
            A complete overview of the delivery.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{order.item}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{order.orderDate}</span>
                </div>
                 <div className="flex items-center gap-2">
                     <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[order.status])}>
                        {order.status}
                      </Badge>
                </div>
                 <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("border-0 font-semibold", paymentStatusStyles[order.paymentStatus])}>
                        {order.paymentStatus}
                      </Badge>
                </div>
                 {order.orderValue && <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>GHS {order.orderValue.toFixed(2)}</span>
                </div>}
                {order.driverName && <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>Driver: {order.driverName}</span>
                </div>}
            </div>
            
            <Separator />
            
            <h3 className="font-semibold text-base">Customer Information</h3>
            {customer ? (
                <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{customer.name}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a>
                    </div>
                </div>
            ): <p>Customer details not available.</p>}
           
            <Separator />
            
            <h3 className="font-semibold text-base">Route Information</h3>
            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                        <p className="font-medium">Pickup</p>
                        <p className="text-muted-foreground">{order.pickup.address}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                     <div>
                        <p className="font-medium">Destination</p>
                        <p className="text-muted-foreground">{order.destination.address}</p>
                    </div>
                </div>
            </div>

        </div>
      </DialogContent>
    )
}

export function AdminDeliveries() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignDriverDialogOpen, setAssignDriverDialogOpen] = useState(false);
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState<Order | null>(null);

  const fetchAndSetData = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const [fetchedOrders, fetchedCustomers, fetchedDrivers] = await Promise.all([
        getOrders(),
        getCustomers(),
        getDrivers(),
      ]);
      setOrders(fetchedOrders);
      setCustomers(fetchedCustomers);
      setDrivers(fetchedDrivers);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData(true);
    const interval = setInterval(() => fetchAndSetData(false), 5000);
    return () => clearInterval(interval);
  }, []);
  
  const getCustomerForOrder = (order: Order) => customers.find(c => c.id === order.customerId);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Truck className="w-6 h-6" /> Active Deliveries
        </CardTitle>
        <CardDescription>
          Real-time monitoring of all active orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>{order.driverName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[order.status])}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>View Order Details</DropdownMenuItem>
                                    </DialogTrigger>
                                    {order.status === 'Pending' && (
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedOrderForAssignment(order);
                                            setAssignDriverDialogOpen(true);
                                        }}>
                                            <UserPlus className="mr-2 h-4 w-4" /> Assign Driver
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => {
                                        const customer = getCustomerForOrder(order);
                                        if (customer?.email) {
                                            window.location.href = `mailto:${customer.email}?subject=Regarding Order ${order.id}`;
                                        }
                                    }}>
                                        Contact Customer
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                           <OrderDetailsDialog order={order} customer={getCustomerForOrder(order)} />
                        </Dialog>
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
                    onAssign={() => fetchAndSetData()}
                    onOpenChange={setAssignDriverDialogOpen}
                />
            </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
