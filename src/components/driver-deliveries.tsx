
"use client";

import { useMemo } from "react";
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
import { Button } from "./ui/button";
import { ChevronRight, Package, Lock, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInHours, formatDistanceToNowStrict } from 'date-fns';

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const urgencyLevels = {
    overdue: { label: "Overdue", style: "bg-red-600 text-white animate-pulse" },
    high: { label: "High Priority", style: "bg-red-500 text-white" },
    medium: { label: "Approaching Deadline", style: "bg-amber-500 text-black" },
    low: { label: "On Schedule", style: "bg-green-500 text-white" },
};

const getUrgency = (createdAt: string) => {
    const hoursElapsed = differenceInHours(new Date(), new Date(createdAt));
    if (hoursElapsed > 48) return urgencyLevels.overdue;
    if (hoursElapsed > 36) return urgencyLevels.high;
    if (hoursElapsed > 24) return urgencyLevels.medium;
    return urgencyLevels.low;
};

const getTimeRemaining = (createdAt: string) => {
    const deadline = new Date(createdAt).getTime() + 48 * 60 * 60 * 1000;
    const now = new Date().getTime();
    if (now > deadline) return 'Overdue';
    return formatDistanceToNowStrict(deadline, { addSuffix: true }).replace('in ', '');
}


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


export function DriverDeliveries({ orders, onSelectOrder }: { orders: Order[], onSelectOrder: (order: Order) => void }) {
  
  const activeOrder = useMemo(() => orders.find(o => o.status === 'Moving'), [orders]);

  const OrderRow = ({ order, index }: { order: Order, index: number }) => {
    const isLocked = activeOrder && activeOrder.id !== order.id;
    const isCurrent = activeOrder && activeOrder.id === order.id;
    const urgency = getUrgency(order.createdAt);
    const timeRemaining = getTimeRemaining(order.createdAt);

    return (
        <TableRow 
            key={order.id} 
            className={cn("transition-colors", {
                "cursor-not-allowed opacity-50": isLocked,
                "cursor-pointer": !isLocked,
                "border-l-4": true,
                "border-green-500": urgency.label === 'On Schedule',
                "border-amber-500": urgency.label === 'Approaching Deadline',
                "border-red-500": urgency.label === 'High Priority',
                "border-red-600": urgency.label === 'Overdue',
            })}
            onClick={() => !isLocked && onSelectOrder(order)}
        >
          <TableCell className="font-mono text-xs w-28 md:w-32">
              <div className="font-bold">{order.id}</div>
              <Badge variant="outline" className={cn('text-xs mt-1 font-semibold', urgency.style)}>
                  {urgency.label}
              </Badge>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <ItemDescription items={order.items} />
          </TableCell>
          <TableCell className="font-medium text-sm">{order.destination.address}</TableCell>
          <TableCell className="w-40">
              <Badge variant="outline" className={cn("font-semibold text-xs mb-1", statusStyles[order.status], {
                  'border-2 border-primary': isCurrent
              })}>
              {order.status}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{timeRemaining} left</span>
              </div>
          </TableCell>
          <TableCell className="text-right">
              <Button variant="ghost" size="icon" disabled={isLocked} asChild>
                  {isLocked ? <Lock className="w-4 h-4" /> : 
                      <div onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}>
                          <ChevronRight className="w-4 h-4" />
                      </div>
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
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order / Urgency</TableHead>
              <TableHead className="hidden md:table-cell">Item(s)</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status / Time</TableHead>
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
