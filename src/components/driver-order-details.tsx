
'use client';

import { useState, useEffect } from 'react';
import { type Order } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
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
import {
  ArrowLeft,
  Check,
  CheckCircle,
  CircleDollarSign,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  PlayCircle,
  Truck,
  Undo2,
  User,
  Wallet,
  X,
  FileText,
  Warehouse
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DeliveryMap } from '@/components/delivery-map';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { DeliveryConfirmationPhoto } from '@/components/delivery-confirmation-photo';
import { updateOrderStatus, confirmDelivery } from '@/lib/data-service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';


const statusStyles: { [key in Order['status']]: string } = {
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  Moving: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Idle: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Returning:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  Delivered:
    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Cancelled:
    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const returnReasons = [
  {
    code: 'RD',
    description: 'Recipient Damaged',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    code: 'IW',
    description: 'Incorrect Item',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    code: 'IQ',
    description: 'Incorrect Quantity',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    code: 'PF',
    description: 'Payment Failed',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    code: 'CR',
    description: 'Customer Refused',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
];

const OrderDetailItem = ({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const Icon = icon;
  return (
    <div className={cn('flex items-start gap-4', className)}>
      <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-grow">
        <p className="font-semibold text-muted-foreground">{label}</p>
        <div className="text-lg font-medium">{children}</div>
      </div>
    </div>
  );
};

export function DriverOrderDetails({
  order,
  onStatusUpdate,
  onBack,
}: {
  order: Order;
  onStatusUpdate: (updatedOrder: Order) => void;
  onBack: () => void;
}) {
  const [isReturnDialogOpen, setReturnDialogOpen] = useState(false);
  const [specificAddress, setSpecificAddress] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const geocodingLibrary = useMapsLibrary('geocoding');

  useEffect(() => {
    if (!geocodingLibrary || !order) return;

    const geocoder = new geocodingLibrary.Geocoder();
    setSpecificAddress(null); // Reset on order change

    geocoder.geocode({ location: order.destination.coords }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
            setSpecificAddress(results[0].formatted_address);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            // Fallback to the generic address if geocoding fails
            setSpecificAddress(order.destination.address);
        }
    });

  }, [order, geocodingLibrary]);


  const handleLocalStatusUpdate = async (
    newStatus: Order['status'],
    reason?: string
  ) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus, reason);
      const updatedOrder: Order = {
        ...order,
        status: newStatus,
        returnReason: reason,
        completedAt:
          newStatus === 'Delivered' ||
          newStatus === 'Returning' ||
          newStatus === 'Cancelled'
            ? new Date().toISOString()
            : undefined,
      };

      onStatusUpdate(updatedOrder);

      toast({
        title: 'Success',
        description: `Order ${order.id} updated to ${newStatus}.`,
      });

      if (newStatus === 'Returning') {
        setReturnDialogOpen(false);
      }
      
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update order status.',
      });
    } finally {
        setIsUpdating(false);
    }
  };
  
  const handlePhotoConfirmed = async () => {
    await confirmDelivery(order.id, "photo-data", "PHOTO"); // data is mocked
    const updatedOrder: Order = { ...order, returnPhotoUrl: `/returns/${order.id}-photo.jpg` };
    onStatusUpdate(updatedOrder);
    toast({
        title: 'Return Photo Submitted!',
        description: 'The return process is now complete.',
    });
  }

  const totalValue = order.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalAmountToCollect = order.paymentType === 'Pay on Credit' ? totalValue : 0;

  return (
    <div className="space-y-6">
      <div
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Deliveries
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex flex-wrap items-center justify-between gap-2 text-3xl">
            <span>Order #{order.id}</span>
            <Badge
              variant="outline"
              className={cn(
                'text-lg font-semibold',
                statusStyles[order.status]
              )}
            >
              {order.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            {order.status === 'Moving'
              ? 'Active delivery. Navigate to the destination.'
              : 'View and manage this delivery.'}
            {order.status === 'Returning' && ` - Reason: ${order.returnReason}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <OrderDetailItem icon={User} label="Recipient Name">
            {order.recipientName}
          </OrderDetailItem>
            <OrderDetailItem icon={Phone} label="Recipient Phone">
            <a
              href={`tel:${order.recipientPhone}`}
              className="text-primary hover:underline"
            >
              {order.recipientPhone}
            </a>
          </OrderDetailItem>
          <OrderDetailItem icon={MapPin} label="Drop-off Point (Destination)">
              {specificAddress ? (
              <>
                {specificAddress}
                <div className="text-sm text-muted-foreground">
                  Lat: {order.destination.coords.lat.toFixed(4)}, Lng: {order.destination.coords.lng.toFixed(4)}
                </div>
              </>
            ) : (
              <Skeleton className="h-6 w-3/4" />
            )}
          </OrderDetailItem>
            <OrderDetailItem icon={Warehouse} label="Pickup Location">
            {order.pickup.address}
          </OrderDetailItem>
          {order.requestedDeliveryTime && (
            <OrderDetailItem icon={Clock} label="Requested Delivery Time">
              {format(new Date(order.requestedDeliveryTime), "PPP 'at' p")}
            </OrderDetailItem>
          )}

          <OrderDetailItem
            icon={order.paymentType === 'Prepaid' ? CreditCard : Wallet}
            label="Payment Status"
            className="md:col-span-2 border-t pt-6"
          >
            <Badge
              variant={order.paymentType === 'Prepaid' ? 'default' : 'secondary'}
              className={cn('text-base', {
                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300':
                  order.paymentType === 'Prepaid',
                'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300':
                  order.paymentType === 'Pay on Credit',
              })}
            >
              {order.paymentType}
            </Badge>
          </OrderDetailItem>

          {order.paymentType === 'Pay on Credit' && (
            <OrderDetailItem
              icon={CircleDollarSign}
              label="Amount to Collect"
            >
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                GHS {totalAmountToCollect.toFixed(2)}
              </span>
            </OrderDetailItem>
          )}
          
            <OrderDetailItem
              icon={FileText}
              label="Total Order Value"
            >
              <span className="text-xl font-bold">
                GHS {totalValue.toFixed(2)}
              </span>
            </OrderDetailItem>

        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                  <Package />
                  Product Details
              </CardTitle>
              <CardDescription>List of all products included in this delivery.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Total Price</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {order.items.map((item, index) => (
                          <TableRow key={index}>
                              <TableCell>
                                  <div className="font-medium">{item.name}</div>
                                  {item.specifics && <div className="text-xs text-muted-foreground">{item.specifics}</div>}
                              </TableCell>
                              <TableCell className="text-center">{item.quantity} {item.unit}</TableCell>
                              <TableCell className="text-right font-mono">GHS {(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/50 p-4 mt-4 rounded-b-lg">
              <Button variant="outline"><FileText className="mr-2"/> View Invoice</Button>
              <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold">GHS {totalValue.toFixed(2)}</div>
              </div>
          </CardFooter>
      </Card>

      {order.status === 'Moving' && order.pickup && order.destination && (
        <DeliveryMap
          origin={order.pickup.coords}
          destination={order.destination.coords}
        />
      )}

      {order.status === 'Pending' && (
        <Button
          size="lg"
          className="w-full text-lg font-bold"
          onClick={() => handleLocalStatusUpdate('Moving')}
          disabled={isUpdating}
        >
          {isUpdating ? "Starting..." : <><PlayCircle className="mr-2" /> Start Delivery</>}
        </Button>
      )}

      {order.status === 'Returning' && !order.returnPhotoUrl && (
        <DeliveryConfirmationPhoto
          orderId={order.id}
          onConfirmed={handlePhotoConfirmed}
        />
      )}

      {(order.status === 'Returning' && order.returnPhotoUrl) && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-300">
              <CheckCircle /> Return Process Complete
            </CardTitle>
            <CardDescription>
              The return has been logged. You will be returned to the main screen shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {order.status === 'Moving' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            size="lg"
            className="w-full bg-green-600 text-lg font-bold hover:bg-green-700"
            onClick={() => handleLocalStatusUpdate('Delivered')}
            disabled={isUpdating}
          >
            {isUpdating ? "Completing..." : <><Check className="mr-2" /> Mark as Delivered</>}
          </Button>

          <AlertDialog
            open={isReturnDialogOpen}
            onOpenChange={setReturnDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-orange-500 text-lg font-bold text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                disabled={isUpdating}
              >
                <Undo2 className="mr-2" /> Initiate Return
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Select Reason for Return</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose the most accurate reason for returning this delivery.
                  This will be reported to dispatch.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-2 gap-3 py-4">
                {returnReasons.map(reason => (
                  <Button
                    key={reason.code}
                    variant="default"
                    className={cn('h-16 text-base font-semibold', reason.color)}
                    onClick={() =>
                      handleLocalStatusUpdate('Returning', reason.description)
                    }
                  >
                    {reason.description}
                  </Button>
                ))}
              </div>
              <AlertDialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setReturnDialogOpen(false)}
                >
                  <X className="mr-2" /> Cancel
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {order.status === 'Delivered' && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle /> Delivery Complete
            </CardTitle>
            <CardDescription>
              This order has been successfully delivered. You will be returned to the main screen shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
