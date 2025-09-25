
"use client";

import { type Order, type OrderItem } from "@/lib/types";
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
import { History, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const ItemDescription = ({ items }: { items: OrderItem[] }) => {
    if (!items || items.length === 0) {
        return <span className="text-muted-foreground">No items</span>;
    }
    const firstItem = items[0];
    const remainingCount = items.length - 1;

    return (
        <div className="flex flex-col">
            <span className="font-medium">{firstItem.quantity} {firstItem.unit} of {firstItem.name}</span>
            {remainingCount > 0 && (
                <span className="text-xs text-muted-foreground">
                    + {remainingCount} more item{remainingCount > 1 ? 's' : ''}
                </span>
            )}
        </div>
    );
};


export function DriverOrderHistory({ orders, onSelectOrder }: { orders: Order[], onSelectOrder: (order: Order) => void; }) {

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="font-headline text-lg flex items-center gap-2">
            <History className="w-5 h-5" /> Completed & Returned
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => onSelectOrder(order)}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>{order.destination.address}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("font-semibold text-xs", statusStyles[order.status])}>
                            {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">
                        {order.completedAt ? format(new Date(order.completedAt), "MMM d") : 'N/A'}
                    </TableCell>
                     <TableCell className="text-right p-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <div>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </Button>
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
        </div>
      </CardContent>
    </Card>
  );
}
