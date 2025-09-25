
'use client';

import { Order } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../ui/separator';
import { OrderTrackingDetails } from './order-tracking-details';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';


interface OrdersListProps {
  orders: Order[];
}

const getStatusVariant = (status: Order['status']): VariantProps<typeof Badge>["variant"] => {
  switch (status) {
    case 'Out for Delivery':
      return 'default';
    case 'Delivered':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    case 'Pending Assignment':
        return 'outline';
    default:
      return 'outline';
  }
};

const getStatusClass = (status: Order['status']) => {
    switch (status) {
        case 'Pending Assignment':
            return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
        default:
            return '';
    }
}

export function OrdersList({ orders }: OrdersListProps) {
  const isMobile = useIsMobile();
  const isActiveDelivery = orders[0] && (orders[0].status === 'Pending Assignment' || orders[0].status === 'Out for Delivery');

  if (isMobile) {
    return (
      <div className="space-y-4 pt-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base">
                <span>Order #{order.id.split('-')[1]}</span>
                <Badge variant={getStatusVariant(order.status)} className={cn(getStatusClass(order.status))}>{order.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Order Date</span>
                <span className="font-medium text-foreground">
                  {format(new Date(order.orderDate), 'PPP')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-medium text-foreground">
                  GH₵{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
            {(order.status === 'Pending Assignment' || order.status === 'Out for Delivery') && (
              <>
                <Separator />
                <CardFooter className="pt-4">
                  <OrderTrackingDetails order={order} />
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue={isActiveDelivery ? orders[0].id : undefined} className="w-full">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date Placed</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
        </Table>
        {orders.map((order) => {
             const isTrackable = order.status === 'Pending Assignment' || order.status === 'Out for Delivery';
            return (
                <AccordionItem value={order.id} key={order.id}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-[100px]">
                                    {isTrackable && (
                                        <AccordionTrigger className="p-0 hover:no-underline"></AccordionTrigger>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">#{order.id.split('-')[1]}</TableCell>
                                <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
                                <TableCell>GH₵{order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                <Badge variant={getStatusVariant(order.status)} className={cn(getStatusClass(order.status))}>{order.status}</Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {isTrackable && (
                        <AccordionContent>
                            <div className="border-t">
                                <OrderTrackingDetails order={order} />
                            </div>
                        </AccordionContent>
                    )}
                </AccordionItem>
            )
        })}
    </Accordion>
  );
}
