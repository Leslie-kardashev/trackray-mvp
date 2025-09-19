
"use client";

import { useMemo } from "react";
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
import { ChevronRight, Package, Lock } from "lucide-react";
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

const ItemDescription = ({ items }: { items: string[] }) => {
    if (!items || items.length === 0) {
        return <span className="text-muted-foreground">No items</span>;
    }
    const firstItem = items[0];
    const remainingCount = items.length - 1;

    return (
        <div className="flex flex-col">
            <span className="font-medium">{firstItem}</span>
            {remainingCount > 0 && (
                <span className="text-xs text-muted-foreground">
                    + {remainingCount} more item{remainingCount > 1 ? 's' : ''}
                </span>
            )}
        </div>
    );
};


export function DriverDeliveries({ orders }: { orders: Order[] }) {
  
  const activeOrder = useMemo(() => orders.find(o => o.status === 'Moving'), [orders]);

  const OrderRow = ({ order, index }: { order: Order, index: number }) => {
    const isLocked = activeOrder && activeOrder.id !== order.id;
    const isCurrent = activeOrder && activeOrder.id === order.id;

    return (
        <TableRow key={order.id} className={cn("transition-colors", {
            "cursor-not-allowed opacity-50": isLocked,
        })}>
          <TableCell className="font-bold text-center w-12 hidden sm:table-cell">{index + 1}</TableCell>
          <TableCell className="font-mono text-xs">{order.id}</TableCell>
          <TableCell className="hidden md:table-cell">
            <ItemDescription items={order.items} />
          </TableCell>
          <TableCell className="font-medium text-sm">{order.destination.address}</TableCell>
          <TableCell>
              <Badge variant="outline" className={cn("font-semibold text-xs", statusStyles[order.status], {
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
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12 hidden sm:table-cell">#</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead className="hidden md:table-cell">Item(s)</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
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
