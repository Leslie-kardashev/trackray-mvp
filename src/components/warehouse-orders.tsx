

"use client";

import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "@/lib/data-service";
import { type Order } from "@/lib/types";
import {
  Card,
  CardContent,
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
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Check, ListOrdered, Truck, Hourglass, ShieldCheck, AlertCircle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

const formatCurrency = (amount: number) => {
    return `GHS ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function OrderTable({ orders, isLoading, onStatusChange, onReportDelay, currentTab }: { orders: Order[], isLoading: boolean, onStatusChange: (orderId: string, newStatus: Order['status']) => void, onReportDelay: (orderId: string, driverName: string) => void, currentTab: string }) {
    if (isLoading) {
        return (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Priority</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Total Value</TableHead>
                        {currentTab === 'ready' && <TableHead>Assigned Driver</TableHead>}
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            {currentTab === 'ready' && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
                            <TableCell className="text-right"><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
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
                    <TableHead>Priority</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total Value</TableHead>
                     {currentTab === 'ready' && <TableHead>Assigned Driver</TableHead>}
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order, index) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-bold text-center">{index + 1}</TableCell>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs text-muted-foreground">{order.destination.address}</div>
                        </TableCell>
                        <TableCell>
                            <ul className="list-disc list-inside">
                                {order.items.map(item => (
                                    <li key={item.name} className="text-xs">{item.quantity}x {item.name}</li>
                                ))}
                            </ul>
                        </TableCell>
                        <TableCell>{formatCurrency(order.orderValue || 0)}</TableCell>
                        {currentTab === 'ready' && (
                             <TableCell>
                                <div className="font-medium">{order.driverName || 'N/A'}</div>
                                <div className="text-xs text-muted-foreground font-mono">{order.driverVehicleId}</div>
                            </TableCell>
                        )}
                        <TableCell className="text-right">
                           {order.status === 'Pending' && (
                                <Button size="sm" onClick={() => onStatusChange(order.id, 'Confirmed')}>
                                    <ShieldCheck className="mr-2" /> Acknowledge & Start Packing
                                </Button>
                            )}
                            {order.status === 'Confirmed' && (
                                <Button size="sm" variant="outline">
                                    <ListOrdered className="mr-2" /> Generate Picklist
                                </Button>
                            )}
                             {order.status === 'Ready for Dispatch' && (
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">
                                            <AlertCircle className="mr-2" /> Report Delay
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Report Driver Delay?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will flag order <span className="font-mono font-bold">{order.id}</span> and notify the operations terminal that the driver, <span className="font-bold">{order.driverName}</span>, is late for pickup. Are you sure?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onReportDelay(order.id, order.driverName || 'Unknown Driver')}>
                                                Yes, Report Delay
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
  const [activeTab, setActiveTab] = useState("pending");


  const fetchOrders = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const allOrders = await getOrders();
      setOrders(allOrders.sort((a,b) => a.priorityScore - b.priorityScore));
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

  const handleReportDelay = (orderId: string, driverName: string) => {
    // In a real app, this would call a service to create a formal report.
    // For this demo, a toast notification simulates sending the report.
    console.log(`Reporting delay for order ${orderId}, driver: ${driverName}`);
    toast({
        variant: "destructive",
        title: "Delay Reported",
        description: `Operations terminal has been notified about the delay for order ${orderId}.`
    });
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
                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                            <OrderTable orders={pendingOrders} isLoading={isLoading} onStatusChange={handleStatusChange} onReportDelay={handleReportDelay} currentTab="pending" />
                        </TabsContent>
                        <TabsContent value="confirmed" className="m-0">
                             <OrderTable orders={confirmedOrders} isLoading={isLoading} onStatusChange={handleStatusChange} onReportDelay={handleReportDelay} currentTab="confirmed" />
                        </TabsContent>
                        <TabsContent value="ready" className="m-0">
                            <OrderTable orders={readyForDispatchOrders} isLoading={isLoading} onStatusChange={handleStatusChange} onReportDelay={handleReportDelay} currentTab="ready" />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
