
'use client';

import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface OrdersListProps {
  orders: Order[];
}

const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'Out for Delivery':
      return 'default';
    case 'Delivered':
      return 'secondary';
    case 'Cancelled':
        return 'destructive';
    default:
      return 'outline';
  }
};

export function OrdersList({ orders }: OrdersListProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4 pt-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base">
                <span>Order #{order.id.split('-')[1]}</span>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className='flex justify-between'>
                    <span>Order Date</span>
                    <span className='font-medium text-foreground'>{format(new Date(order.orderDate), 'PPP')}</span>
                </div>
                 <div className='flex justify-between'>
                    <span>Total Amount</span>
                    <span className='font-medium text-foreground'>GH₵{order.totalAmount.toFixed(2)}</span>
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
               {(order.status === 'Pending Assignment' || order.status === 'Out for Delivery') && (
                <Button asChild className='w-full' >
                    <Link href={`/customer/tracking/${order.id}`}>Track on Map</Link>
                </Button>
               )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date Placed</TableHead>
          <TableHead>Scheduled Delivery</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id.split('-')[1]}</TableCell>
            <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
            <TableCell>{format(new Date(order.scheduledDeliveryDate), 'PPP')}</TableCell>
            <TableCell>GH₵{order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {(order.status === 'Pending Assignment' || order.status === 'Out for Delivery') && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/customer/tracking/${order.id}`}>Track on Map</Link>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
