
"use client";

import { useState, useEffect } from "react";
import { getArchivedOrders } from "@/lib/data-service";
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
import { Input } from "@/components/ui/input";
import { Search, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function WarehouseHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const fetchedOrders = await getArchivedOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(filter.toLowerCase()) ||
    order.customerName.toLowerCase().includes(filter.toLowerCase()) ||
    order.driverName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <History className="w-6 h-6" /> Pickup & Dispatch History
                </CardTitle>
                <CardDescription>
                  A searchable log of all orders that have been dispatched from the warehouse.
                </CardDescription>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by ID, customer, or driver..." 
                    className="w-80 pl-8"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
            <Table>
                <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Final Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        </TableRow>
                    ))
                    ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono">{order.id}</TableCell>
                            <TableCell className="font-medium">{order.item}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.driverName || 'N/A'}</TableCell>
                            <TableCell>{order.orderDate}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("font-semibold", statusStyles[order.status])}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                            No historical orders found.
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
