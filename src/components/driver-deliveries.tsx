
"use client";

import { useState, useEffect, useMemo } from "react";
import { getAssignedOrders } from "@/lib/data-service";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ChevronRight, Package, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function DriverDeliveries() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDriverOrders = async () => {
    try {
      setIsLoading(true);
      // In a real app, driverId would come from auth state
      const driverOrders = await getAssignedOrders("DRV-001");
      
      const activeOrders = driverOrders.filter(
        o => o.status === 'Moving' || o.status === 'Pending' || o.status === 'Returning'
      );

      // Sort orders: 'Moving' status comes first, then 'Pending', then by ID
      const sortedOrders = activeOrders.sort((a, b) => {
        if (a.status === 'Moving' && b.status !== 'Moving') return -1;
        if (a.status !== 'Moving' && b.status === 'Moving') return 1;
        if (a.status === 'Returning' && b.status !== 'Returning') return -1;
        if (a.status !== 'Returning' && b.status === 'Returning') return 1;
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return a.id.localeCompare(b.id);
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Failed to fetch driver orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your deliveries.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverOrders();
  }, []);

  const activeOrder = useMemo(() => orders.find(o => o.status === 'Moving' || o.status === 'Returning'), [orders]);

  const OrderRow = ({ order, index }: { order: Order, index: number }) => {
    const isLocked = activeOrder && activeOrder.id !== order.id;
    const isCurrent = activeOrder && activeOrder.id === order.id;

    return (
        <TableRow key={order.id} className={cn("transition-colors", {
            "cursor-not-allowed opacity-50": isLocked,
        })}>
          <TableCell className="font-bold text-center w-12">{index + 1}</TableCell>
          <TableCell className="font-mono">{order.id}</TableCell>
          <TableCell className="font-medium">{order.itemDescription}</TableCell>
          <TableCell>{order.destination.address}</TableCell>
          <TableCell>
              <Badge variant="outline" className={cn("font-semibold", statusStyles[order.status], {
                  'border-2 border-primary': isCurrent
              })}>
              {order.status}
              </Badge>
          </TableCell>
          <TableCell className="text-right">
              <Button variant="ghost" size="icon" disabled={isLocked} asChild>
                  {isLocked ? <Lock className="w-4 h-4" /> : 
                      <Link href={`/driver/${order.id}`}>
                          <ChevronRight className="w-4 h-4" />
                      </Link>
                  }
              </Button>
          </TableCell>
        </TableRow>
    );
  };


  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Package className="w-6 h-6" /> My Active Deliveries
        </CardTitle>
        <CardDescription>
          Your prioritized list of assigned deliveries. Complete the active order to unlock the next.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">#</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <OrderRow key={order.id} order={order} index={index} />
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No active deliveries assigned.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
