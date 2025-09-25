
"use client";

import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "@/lib/data-service";
import { type Order } from "@/lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Check, ListOrdered, Truck, Hourglass } from "lucide-react";

const statusStyles: { [key in Order['status']]: string } = {
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Ready for Dispatch': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Dispatched': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};

const formatCurrency = (amount: number) => {
    return `GHS ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function OrderTable({ orders, isLoading, onStatusChange }: { orders: Order[], isLoading: boolean, onStatusChange: (orderId: string, newStatus: Order['status']) => void }) {
    if (isLoading) {
        return (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
    
    if (orders.length === 0) {
        return <div className="text-center text-muted-foreground p-8">No orders in this category.</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map(order => (
                    <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs text-muted-foreground">{order.destination.address}</div>
                        </TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{formatCurrency(order.orderValue || 0)}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell className="text-right">
                           {order.status === 'Pending' && (
                                <Button size="sm" onClick={() => onStatusChange(order.id, 'Confirmed')}>
                                    <Check className="mr-2" /> Confirm Order
                                </Button>
                            )}
                            {order.status === 'Confirmed' && (
                                <Button size="sm" variant="outline">
                                    <ListOrdered className="mr-2" /> Generate Picklist
                                </Button>
                            )}
                             {order.status === 'Ready for Dispatch' && (
                                <Button size="sm" variant="secondary">
                                    <Truck className="mr-2" /> Assign Driver
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export function WarehouseOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const allOrders = await getOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch orders." });
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
        await updateOrderStatus(orderId, newStatus);
        toast({ title: "Order Updated", description: `Order ${orderId} has been moved to ${newStatus}.` });
        fetchOrders(); // Refresh data
    } catch (error) {
        toast({ variant: "destructive", title: "Update Failed", description: `Could not update order ${orderId}.` });
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed');
  const readyForDispatchOrders = orders.filter(o => o.status === 'Ready for Dispatch');

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">Order Management</h1>
            <p className="text-muted-foreground">
                View, confirm, and process incoming orders from the sales terminal.
            </p>
        </div>

        <Card>
            <CardContent className="p-0">
                <Tabs defaultValue="pending">
                    <div className="p-4 border-b">
                        <TabsList>
                            <TabsTrigger value="pending">
                                <Hourglass className="mr-2" /> Pending ({pendingOrders.length})
                            </TabsTrigger>
                            <TabsTrigger value="confirmed">
                                <Check className="mr-2" /> Confirmed ({confirmedOrders.length})
                            </TabsTrigger>
                            <TabsTrigger value="ready">
                                <Truck className="mr-2" /> Ready for Dispatch ({readyForDispatchOrders.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <ScrollArea className="h-[calc(100vh-280px)]">
                        <TabsContent value="pending" className="m-0">
                            <OrderTable orders={pendingOrders} isLoading={isLoading} onStatusChange={handleStatusChange} />
                        </TabsContent>
                        <TabsContent value="confirmed" className="m-0">
                             <OrderTable orders={confirmedOrders} isLoading={isLoading} onStatusChange={handleStatusChange} />
                        </TabsContent>
                        <TabsContent value="ready" className="m-0">
                            <OrderTable orders={readyForDispatchOrders} isLoading={isLoading} onStatusChange={handleStatusChange} />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
