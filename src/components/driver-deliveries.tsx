
"use client";

import { useState, useEffect } from "react";
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
import { ChevronRight, Package } from "lucide-react";
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
      setOrders(driverOrders);
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

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Package className="w-6 h-6" /> My Deliveries
        </CardTitle>
        <CardDescription>
          Your list of assigned deliveries. Tap an order to view details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
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
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">
                    <Link href={`/driver/${order.id}`} className="block w-full">{order.id}</Link>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/driver/${order.id}`} className="block w-full">{order.itemDescription}</Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/driver/${order.id}`} className="block w-full">{order.destination.address}</Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/driver/${order.id}`} className="block w-full">
                        <Badge variant="outline" className={cn("font-semibold", statusStyles[order.status])}>
                        {order.status}
                        </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/driver/${order.id}`} className="block w-full">
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
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
