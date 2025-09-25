
"use client";

import { useState, useEffect } from "react";
import { getOrders, confirmOrderPickup } from "@/lib/data-service";
import { type Order } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { PackageCheck, Truck } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";

export function WarehousePickups() {
  const [pickupOrders, setPickupOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPickupOrders = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const allOrders = await getOrders();
      const filteredAndSortedOrders = allOrders
        .filter((order) => order.status === "Ready for Dispatch")
        .sort((a, b) => a.priorityScore - b.priorityScore);
      setPickupOrders(filteredAndSortedOrders);
    } catch (error) {
      console.error("Failed to fetch pickup orders:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch pickup orders." });
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  const handleConfirmPickup = async (orderId: string) => {
    try {
      await confirmOrderPickup(orderId);
      toast({ title: "Order Dispatched", description: `Order ${orderId} is now on its way.` });
      fetchPickupOrders();
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "Could not confirm pickup." });
    }
  }

  useEffect(() => {
    fetchPickupOrders(true);
    const interval = setInterval(() => fetchPickupOrders(false), 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getPriorityBadge = (pickupTime: string | undefined) => {
      if (!pickupTime) return null;
      const now = new Date();
      const scheduled = new Date(pickupTime);
      const diffMinutes = (scheduled.getTime() - now.getTime()) / 60000;
      
      if (diffMinutes < -30) {
          return <Badge variant="destructive">Late</Badge>;
      }
      if (diffMinutes < 15) {
          return <Badge variant="outline" className="text-yellow-600 border-yellow-500">Due</Badge>;
      }
      return null;
  }

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
                        <TableHead>Priority</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Driver</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        </TableRow>
                    ))
                    ) : pickupOrders.length > 0 ? (
                    pickupOrders.map((order, index) => {
                        return (
                            <TableRow key={order.id}>
                                <TableCell className="font-bold text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span>{index + 1}</span>
                                        {getPriorityBadge(order.scheduledPickupTime)}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                <TableCell className="text-xs">
                                     <div className="font-medium flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-muted-foreground" />
                                        {order.driverName}
                                    </div>
                                    <div className="text-muted-foreground font-mono ml-6">{order.driverVehicleId}</div>
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
       <CardFooter className="p-2 border-t">
            {pickupOrders.length > 0 && (
                <Button size="sm" className="w-full" onClick={() => handleConfirmPickup(pickupOrders[0].id)}>
                    <PackageCheck className="mr-2" /> Confirm Pickup for Order {pickupOrders[0].id}
                </Button>
            )}
        </CardFooter>
    </Card>
  );
}
