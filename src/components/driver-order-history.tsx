
"use client";

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
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { History } from "lucide-react";

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const ItemDescription = ({ items }: { items: string[] }) => {
    if (!items || items.length === 0) {
        return <span className="text-muted-foreground">No items</span>;
    }
    const firstItem = items[0];
    const remainingCount = items.length - 1;

    return (
        <>
            {firstItem}
            {remainingCount > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                    (+{remainingCount})
                </span>
            )}
        </>
    );
};


// This is now a "dumb" component that just receives props
export function DriverOrderHistory({ orders }: { orders: Order[] }) {

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <History className="w-6 h-6" /> Completed & Returned Orders
        </CardTitle>
        <CardDescription>
          A record of your completed, cancelled, and returned deliveries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead className="hidden sm:table-cell">Item(s)</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Completed On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">
                       <ItemDescription items={order.items} />
                    </TableCell>
                    <TableCell>{order.destination.address}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("font-semibold", statusStyles[order.status])}>
                            {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {order.completedAt ? format(new Date(order.completedAt), "PPp") : 'N/A'}
                    </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        You have no completed orders yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
