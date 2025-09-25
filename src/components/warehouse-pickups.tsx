
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
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PackageCheck className="w-5 h-5" /> Awaiting Pickup
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
            <Table>
                <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Priority</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        </TableRow>
                    ))
                    ) : pickupOrders.length > 0 ? (
                    pickupOrders.map((order) => {
                        const priority = getPriorityStatus(order.scheduledPickupTime);
                        return (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                <TableCell className="font-medium text-xs flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-muted-foreground" />
                                    {order.driverName}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("font-semibold text-xs", priorityStyles[priority])}>
                                        {priority}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24 text-xs">
                            No orders are awaiting pickup.
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
