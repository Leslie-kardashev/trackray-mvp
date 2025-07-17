
"use client";

import { useState, useEffect } from "react";
import { getOrders } from "@/lib/data-service";
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
import { Skeleton } from "./ui/skeleton";
import { PackageCheck, Truck } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function WarehousePickups() {
  const [pickupOrders, setPickupOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPickupOrders = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const allOrders = await getOrders();
      const filteredOrders = allOrders.filter(
        (order) => order.status === "Ready for Pickup"
      );
      setPickupOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch pickup orders:", error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupOrders(true);
    const interval = setInterval(() => fetchPickupOrders(false), 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <PackageCheck className="w-6 h-6" /> Awaiting Pickup
        </CardTitle>
        <CardDescription>
          Orders assigned to drivers, ready for collection from the warehouse.
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    </TableRow>
                ))
                ) : pickupOrders.length > 0 ? (
                pickupOrders.map((order) => (
                    <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        {order.driverName}
                    </TableCell>
                    <TableCell>{order.item}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
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
