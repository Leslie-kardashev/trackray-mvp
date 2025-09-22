
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type Order } from '@/lib/types';
import { fetchAllOrders } from '@/lib/data-service';
import { DriverDeliveries } from "@/components/driver-deliveries";
import { DriverOrderHistory } from "@/components/driver-order-history";
import { DriverSOS } from "@/components/driver-sos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, History } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DriverOrderDetails } from '@/components/driver-order-details';

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1 w-full">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
}

export default function DriverDashboard() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  
  const driverId = "DRV-001"; // Hardcoded for now
  
  const getOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await fetchAllOrders(); 
      const driverOrders = fetchedOrders.filter(o => o.driverId === driverId);
      setAllOrders(driverOrders);
    } catch (error) {
      console.error("Failed to fetch driver orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your deliveries. Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, driverId]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);
  
  const { activeOrders, historyOrders } = useMemo(() => {
    const active = allOrders.filter(
      o => o.status === 'Moving' || o.status === 'Pending'
    ).sort((a, b) => {
        if (a.status === 'Moving' && b.status !== 'Moving') return -1;
        if (a.status !== 'Moving' && b.status === 'Moving') return 1;
        // Then sort by creation date for priority
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    const history = allOrders.filter(
      o => o.status === 'Delivered' || o.status === 'Cancelled' || o.status === 'Returning'
    ).sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
    
    return { activeOrders: active, historyOrders: history };
  }, [allOrders]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const handleUpdateOrder = (updatedOrder: Order) => {
    setAllOrders(prevOrders => 
      prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
    );
    // If the status is final, go back to the list view after a short delay
    if (updatedOrder.status === 'Delivered' || updatedOrder.status === 'Cancelled' || (updatedOrder.status === 'Returning' && updatedOrder.returnPhotoUrl)) {
        setTimeout(() => {
          setSelectedOrder(null);
        }, 1500)
    } else {
      // Otherwise, just update the details in place
      setSelectedOrder(updatedOrder);
    }
  }

  const handleBackToList = () => {
    setSelectedOrder(null);
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (selectedOrder) {
    return <DriverOrderDetails order={selectedOrder} onStatusUpdate={handleUpdateOrder} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Driver Hub</h1>
        <p className="text-muted-foreground">
          Your command center for all deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">
                        <ListTodo className="mr-2 h-4 w-4" /> Active Deliveries ({activeOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" /> Order History ({historyOrders.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <DriverDeliveries orders={activeOrders} onSelectOrder={handleSelectOrder} />
                </TabsContent>
                <TabsContent value="history">
                  <DriverOrderHistory orders={historyOrders} onSelectOrder={handleSelectOrder} />
                </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1 w-full lg:sticky lg:top-24">
            <DriverSOS />
        </div>
      </div>
    </div>
  );
}
