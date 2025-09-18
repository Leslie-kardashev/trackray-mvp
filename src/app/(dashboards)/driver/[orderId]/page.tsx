
'use client';

import { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus } from '@/lib/data-service';
import { type Order } from '@/lib/types';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, CheckCircle, Clock, MapPin, Package, Phone, PlayCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { DeliveryMap } from '@/components/delivery-map';
import { APIProvider } from '@vis.gl/react-google-maps';

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const OrderDetailItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => {
    const Icon = icon;
    return (
        <div className="flex items-start gap-4">
            <Icon className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
                <p className="font-semibold text-muted-foreground">{label}</p>
                <p className="text-lg font-medium">{children}</p>
            </div>
        </div>
    );
}

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const params = useParams();
  const orderId = params.orderId as string;

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
        setIsLoading(true);
        const fetchedOrder = await getOrderById(orderId);
        if (fetchedOrder) {
            setOrder(fetchedOrder);
        } else {
            notFound();
        }
    } catch (error) {
        console.error("Failed to fetch order details:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch order details.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
        await updateOrderStatus(orderId, newStatus);
        toast({
            title: "Success",
            description: `Order ${orderId} has been updated to ${newStatus}.`
        });
        fetchOrderDetails(); // Re-fetch to update UI
    } catch (error) {
        console.error("Failed to update order status:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Could not update order ${orderId}.`
        });
    }
  };


  if (isLoading || !order) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }


  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className="space-y-6">
            <Link href="/driver" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Deliveries
            </Link>

            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-3xl flex justify-between items-center">
                    <span>Order #{order.id}</span>
                    <Badge variant="outline" className={cn("text-lg font-semibold", statusStyles[order.status])}>
                        {order.status}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    {order.status === 'Moving' ? 'Active delivery. Navigate to the destination.' : 'View and manage this delivery.'}
                </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <OrderDetailItem icon={Package} label="Item Description">
                        {order.itemDescription} (x{order.quantity})
                    </OrderDetailItem>
                    <OrderDetailItem icon={MapPin} label="Destination">
                        {order.destination.address}
                    </OrderDetailItem>
                    <OrderDetailItem icon={User} label="Recipient Name">
                        {order.recipientName}
                    </OrderDetailItem>
                    <OrderDetailItem icon={Phone} label="Recipient Phone">
                        <a href={`tel:${order.recipientPhone}`} className="text-primary hover:underline">{order.recipientPhone}</a>
                    </OrderDetailItem>
                    {order.requestedDeliveryTime && (
                        <OrderDetailItem icon={Clock} label="Requested Delivery Time">
                            {format(new Date(order.requestedDeliveryTime), "PPP 'at' p")}
                        </OrderDetailItem>
                    )}
                </CardContent>
            </Card>

            {order.status === 'Moving' && order.pickup && order.destination && (
                <DeliveryMap 
                    origin={order.pickup.coords} 
                    destination={order.destination.coords}
                />
            )}
            
            {order.status === 'Pending' && (
                <Button size="lg" className="w-full text-lg font-bold" onClick={() => handleStatusUpdate(order.id, 'Moving')}>
                    <PlayCircle className="mr-2" /> Start Delivery
                </Button>
            )}

            {order.status === 'Moving' && (
                <Button size="lg" className="w-full text-lg font-bold bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(order.id, 'Delivered')}>
                    <Check className="mr-2" /> Mark as Delivered
                </Button>
            )}

            {order.status === 'Delivered' && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader className="text-center">
                        <CardTitle className="text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                            <CheckCircle /> Delivery Complete
                        </CardTitle>
                        <CardDescription>
                            This order has been successfully delivered.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

        </div>
    </APIProvider>
  );
}
