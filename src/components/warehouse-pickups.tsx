
"use client";

import { useState, useEffect } from "react";
import { getOrders, confirmOrderPickup } from "@/lib/data-service";
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
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { PackageCheck, Truck, CheckCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";

type PriorityStatus = 'Late' | 'Due' | 'Upcoming';

const priorityStyles: { [key in PriorityStatus]: string } = {
  'Late': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Due': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

const getPriorityStatus = (pickupTime?: string): PriorityStatus => {
    if (!pickupTime) return 'Upcoming';
    const time = new Date(pickupTime);
    if (isPast(time)) return 'Late';
    if (isToday(time)) return 'Due';
    return 'Upcoming';
}

export function WarehousePickups() {
  const [pickupOrders, setPickupOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPickupOrders = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const allOrders = await getOrders();
      const filteredAndSortedOrders = allOrders
        .filter((order) => order.status === "Ready for Pickup")
        .sort((a, b) => { // FIFO principle - sort by scheduled time
            const timeA = a.scheduledPickupTime ? new Date(a.scheduledPickupTime).getTime() : Infinity;
            const timeB = b.scheduledPickupTime ? new Date(b.scheduledPickupTime).getTime() : Infinity;
            return timeA - timeB;
        });
      setPickupOrders(filteredAndSortedOrders);
    } catch (error) {
      console.error("Failed to fetch pickup orders:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch pickup orders." });
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupOrders(true);
    const interval = setInterval(() => fetchPickupOrders(false), 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsPickedUp = async (orderId: string) => {
    try {
        await confirmOrderPickup(orderId);
        toast({ title: "Success", description: `Order ${orderId} marked as picked up.` });
        fetchPickupOrders(); // Refresh the list
    } catch (error) {
        console.error("Failed to confirm pickup:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not mark order as picked up." });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <PackageCheck className="w-6 h-6" /> Awaiting Pickup
        </CardTitle>
        <CardDescription>
          Orders assigned to drivers, ready for collection from the warehouse. Sorted by urgency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
            <Table>
            <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Scheduled Pickup</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
                    </TableRow>
                ))
                ) : pickupOrders.length > 0 ? (
                pickupOrders.map((order) => {
                    const priority = getPriorityStatus(order.scheduledPickupTime);
                    return (
                        <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell className="font-medium flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            {order.driverName}
                        </TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>
                            {order.scheduledPickupTime ? format(new Date(order.scheduledPickupTime), "MMM d, h:mm a") : 'ASAP'}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn("font-semibold", priorityStyles[priority])}>
                                {priority}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => handleMarkAsPickedUp(order.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Picked Up
                            </Button>
                        </TableCell>
                        </TableRow>
                    );
                })
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No orders are currently awaiting pickup.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
