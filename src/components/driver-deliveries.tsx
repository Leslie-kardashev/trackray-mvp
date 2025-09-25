
"use client";

import { useMemo } from "react";
import { type Order, type OrderItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { ChevronRight, Package, Lock, Clock, MapPin, AlertCircle, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { differenceInHours, formatDistanceToNowStrict } from 'date-fns';
import { GeocodedAddress } from "./geocoded-address";

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const urgencyLevels = {
    overdue: { label: "Overdue", color: "text-red-600", borderColor: "border-red-600" },
    high: { label: "High Priority", color: "text-red-500", borderColor: "border-red-500" },
    medium: { label: "Approaching Deadline", color: "text-amber-500", borderColor: "border-amber-500" },
    low: { label: "On Schedule", color: "text-green-600", borderColor: "border-green-500" },
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
        <div className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{firstItem.quantity} {firstItem.unit} of {firstItem.name}</span>
            {remainingCount > 0 && (
                <span className="text-sm text-muted-foreground">
                    + {remainingCount} more
                </span>
            )}
        </div>
    );
};

export function DriverDeliveries({ orders, onSelectOrder }: { orders: Order[], onSelectOrder: (order: Order) => void }) {
  
  const activeOrder = useMemo(() => orders.find(o => o.status === 'Moving'), [orders]);

  const OrderCard = ({ order, index }: { order: Order, index: number }) => {
    const isLocked = activeOrder && activeOrder.id !== order.id;
    const isCurrent = activeOrder && activeOrder.id === order.id;
    const urgency = getUrgency(order.createdAt);
    const timeRemaining = getTimeRemaining(order.createdAt);

    return (
        <Card 
            key={order.id} 
            className={cn("transition-all overflow-hidden", {
                "opacity-60 bg-muted/50": isLocked,
                "cursor-pointer hover:border-primary": !isLocked,
                "border-primary border-2 shadow-lg": isCurrent,
            }, urgency.borderColor)}
            onClick={() => !isLocked && onSelectOrder(order)}
        >
            <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0 gap-3">
                {isCurrent ? (
                     <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">
                        1
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted font-bold text-lg flex-shrink-0">
                        {index + 1}
                    </div>
                )}
                <CardTitle className="text-lg font-bold flex-grow truncate">{order.id}</CardTitle>
                <Badge variant="outline" className={cn("font-semibold text-sm", statusStyles[order.status])}>
                  {order.status}
                </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 text-sm">
                <div className="flex items-start gap-2 font-semibold text-lg">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <GeocodedAddress coords={order.destination.coords} fallbackAddress={order.destination.address} />
                </div>
                <ItemDescription items={order.items} />
                <div className={cn("flex items-center gap-2 font-medium text-base", urgency.color)}>
                    {urgency.label === "Overdue" || urgency.label === "High Priority" ? (
                        <AlertCircle className="h-4 w-4" />
                    ) : (
                        <Clock className="h-4 w-4" />
                    )}
                    <span>{timeRemaining} remaining</span>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-2 flex justify-end">
                <Button variant="ghost" size="sm" disabled={isLocked} className="h-8 w-8 p-0">
                    {isLocked ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-5 h-5" />}
                </Button>
            </CardFooter>
        </Card>
    );
  };

  return (
    <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))
        ) : (
            <Card className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                <Package className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">All Clear!</h3>
                <p>No active deliveries assigned right now.</p>
            </Card>
        )}
    </div>
  );
}
