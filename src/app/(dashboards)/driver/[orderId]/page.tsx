
'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/data-service';
import { type Order } from '@/lib/types';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DriverOrderDetails } from '@/components/driver-order-details';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setIsLoading(true);
      try {
        const fetchedOrder = await getOrderById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Order not found.' });
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load order details.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);
  
  const handleStatusUpdate = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return <div>Google Maps API Key is missing.</div>;
  }

  if (isLoading || !order) {
    return (
        <div className="space-y-6 p-4 md:p-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <DriverOrderDetails order={order} onStatusUpdate={handleStatusUpdate} />
    </APIProvider>
  );
}
