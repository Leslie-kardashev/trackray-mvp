
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { FileText, Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { InvoiceDialog } from "./invoice-dialog";

const paymentStatusStyles: { [key in Order['paymentStatus']]: string } = {
    'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Pay on Delivery': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const deliveryStatusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Ready for Pickup': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};

export function FinanceDeliveriesOverview() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const fetchOrders = async (isInitialLoad = false) => {
        if (isInitialLoad) setIsLoading(true);
        try {
            const fetchedOrders = await getOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            if (isInitialLoad) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(true);
        const interval = setInterval(() => fetchOrders(false), 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredOrders = orders.filter(order =>
        order.customerName.toLowerCase().includes(filter.toLowerCase()) ||
        order.id.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Deliveries Financial Overview</CardTitle>
                <CardDescription>View and manage financial data for all deliveries.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by customer or ID..." 
                        className="w-64 pl-8"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
            <Table>
            <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Order Value</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Payment Status</TableHead>
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
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    filteredOrders.map((delivery) => (
                    <TableRow key={delivery.id}>
                        <TableCell className="font-mono">{delivery.id}</TableCell>
                        <TableCell>{delivery.customerName}</TableCell>
                        <TableCell>{delivery.driverName || 'N/A'}</TableCell>
                        <TableCell>GHS {delivery.orderValue?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>{delivery.orderDate}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn("border-0", deliveryStatusStyles[delivery.status])}>
                                {delivery.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline" className={cn("border-0", paymentStatusStyles[delivery.paymentStatus])}>
                            {delivery.paymentStatus}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="outline" size="sm" onClick={() => setSelectedOrderId(delivery.id)}>
                                <FileText className="mr-2 h-4 w-4" /> View Invoice
                           </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
    {selectedOrderId && (
        <InvoiceDialog
            orderId={selectedOrderId}
            open={!!selectedOrderId}
            onOpenChange={(open) => {
                if (!open) {
                    setSelectedOrderId(null);
                }
            }}
        />
     )}
    </>
  );
}
