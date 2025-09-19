
'use client';

import { useEffect, useState } from 'react';
import { type Order } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Check, CheckCircle, CircleDollarSign, Clock, CreditCard, MapPin, Package, Phone, PlayCircle, Truck, Undo2, User, Wallet, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { DeliveryMap } from '@/components/delivery-map';
import { APIProvider } from '@vis.gl/react-google-maps';
import { DeliveryConfirmationPhoto } from '@/components/delivery-confirmation-photo';

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'Moving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Idle': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Returning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const returnReasons = [
    { code: 'RD', description: 'Recipient Damaged', color: 'bg-red-500 hover:bg-red-600' },
    { code: 'IW', description: 'Incorrect Item', color: 'bg-red-500 hover:bg-red-600' },
    { code: 'IQ', description: 'Incorrect Quantity', color: 'bg-orange-500 hover:bg-orange-600' },
    { code: 'PF', description: 'Payment Failed', color: 'bg-orange-500 hover:bg-orange-600' },
    { code: 'CR', description: 'Customer Refused', color: 'bg-blue-500 hover:bg-blue-600' },
];


const OrderDetailItem = ({ icon, label, children, className }: { icon: React.ElementType, label: string, children: React.ReactNode, className?: string }) => {
    const Icon = icon;
    return (
        <div className={cn("flex items-start gap-4", className)}>
            <Icon className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
                <p className="font-semibold text-muted-foreground">{label}</p>
                <div className="text-lg font-medium">{children}</div>
            </div>
        </div>
    );
}

// This component is now "controlled" by the parent `DriverDashboard`
export default function OrderDetailsPage({ 
    order, 
    onStatusUpdate 
}: { 
    order: Order; // Now expecting a non-null order
    onStatusUpdate: (orderId: string, newStatus: Order['status'], reason?: string) => void;
}) {
  const [isReturnDialogOpen, setReturnDialogOpen] = useState(false);
  const [photoSubmitted, setPhotoSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const handleStatusUpdate = async (newStatus: Order['status'], reason?: string) => {
    if (!order) return;

    // Call the parent's update function to modify the central state
    onStatusUpdate(order.id, newStatus, reason);

    toast({
        title: "Success",
        description: `Order ${order.id} updated to ${newStatus}.`
    });

    if (newStatus === 'Returning') {
        setReturnDialogOpen(false);
    }
    
    const isTerminalStatus = newStatus === 'Delivered' || newStatus === 'Returning' || newStatus === 'Cancelled';
    if(isTerminalStatus) {
        // For returning, we wait for the photo submission before redirecting.
        // For other terminal statuses, we can redirect immediately after a delay.
        if (newStatus !== 'Returning' || (order.returnPhotoUrl || photoSubmitted)) {
            setTimeout(() => {
                router.push('/driver');
            }, 1500);
        }
    }
  };


  if (!order) {
    // This case should ideally not be hit if the parent component manages loading state
    return (
        <div className="space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Google Maps API key is missing. Please add it to your .env file.</p>
      </div>
    )
  }

  const totalAmountToCollect = order.paymentType === 'Pay on Delivery'
    ? (order.productPrice || 0) + order.deliveryFee
    : 0;

  return (
    <APIProvider apiKey={apiKey}>
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
                     {order.status === 'Returning' && ` - Reason: ${order.returnReason}`}
                </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <OrderDetailItem icon={Package} label="Items" className="md:col-span-2">
                        <ul className="list-disc list-inside space-y-1 text-base">
                            {order.items.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
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
                     <OrderDetailItem icon={Truck} label="Delivery Fee">
                        GHS {order.deliveryFee.toFixed(2)}
                    </OrderDetailItem>
                    <OrderDetailItem 
                        icon={order.paymentType === 'Prepaid' ? CreditCard : Wallet}
                        label="Payment Type"
                    >
                        <Badge 
                            variant={order.paymentType === 'Prepaid' ? 'default' : 'secondary'} 
                            className={cn('text-base', {
                                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': order.paymentType === 'Prepaid',
                                'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300': order.paymentType === 'Pay on Delivery'
                            })}
                        >
                            {order.paymentType}
                        </Badge>
                    </OrderDetailItem>
                    
                    {order.paymentType === 'Pay on Delivery' && (
                        <OrderDetailItem 
                            icon={CircleDollarSign} 
                            label="Amount to Collect"
                            className="md:col-span-2 border-t pt-6"
                        >
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                GHS {totalAmountToCollect.toFixed(2)}
                            </span>
                             <div className="text-sm text-muted-foreground">
                                (Product Price: GHS {order.productPrice?.toFixed(2)} + Delivery Fee: GHS {order.deliveryFee.toFixed(2)})
                            </div>
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
                <Button size="lg" className="w-full text-lg font-bold" onClick={() => handleStatusUpdate('Moving')}>
                    <PlayCircle className="mr-2" /> Start Delivery
                </Button>
            )}

            {order.status === 'Returning' && !order.returnPhotoUrl && !photoSubmitted &&(
                <DeliveryConfirmationPhoto 
                    orderId={order.id} 
                    onConfirmed={() => {
                        setPhotoSubmitted(true);
                        // Now that photo is "submitted", trigger the final navigation
                        setTimeout(() => router.push('/driver'), 1500);
                    }}
                />
            )}
            
            {(order.status === 'Returning' && (order.returnPhotoUrl || photoSubmitted)) && (
                 <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                    <CardHeader className="text-center">
                        <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center justify-center gap-2">
                            <CheckCircle /> Return Process Complete
                        </CardTitle>
                        <CardDescription>
                            The return has been logged. You will be redirected shortly.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {order.status === 'Moving' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button size="lg" className="w-full text-lg font-bold bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate('Delivered')}>
                        <Check className="mr-2" /> Mark as Delivered
                    </Button>

                    <AlertDialog open={isReturnDialogOpen} onOpenChange={setReturnDialogOpen}>
                        <AlertDialogTrigger asChild>
                             <Button size="lg" variant="outline" className="w-full text-lg font-bold border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600">
                                <Undo2 className="mr-2" /> Initiate Return
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Select Reason for Return</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Choose the most accurate reason for returning this delivery. This will be reported to dispatch.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid grid-cols-2 gap-3 py-4">
                                {returnReasons.map(reason => (
                                    <Button
                                        key={reason.code}
                                        variant="default"
                                        className={cn('h-16 text-base font-semibold', reason.color)}
                                        onClick={() => handleStatusUpdate('Returning', reason.description)}
                                    >
                                        {reason.description}
                                    </Button>
                                ))}
                            </div>
                            <AlertDialogFooter>
                                <Button variant="ghost" onClick={() => setReturnDialogOpen(false)}>
                                    <X className="mr-2" /> Cancel
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            {order.status === 'Delivered' && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader className="text-center">
                        <CardTitle className="text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                            <CheckCircle /> Delivery Complete
                        </CardTitle>
                        <CardDescription>
                            This order has been successfully delivered. You will be redirected shortly.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

        </div>
    </APIProvider>
  );
}

    