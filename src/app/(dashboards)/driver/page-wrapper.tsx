
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type Order } from '@/lib/types';
import { fetchAllOrders } from '@/lib/data-service';
import { DriverDeliveries } from "@/components/driver-deliveries";
import { DriverOrderHistory } from "@/components/driver-order-history";
import { DriverSOS } from "@/components/driver-sos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, History } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import OrderDetailsPage from './[orderId]/page';

export default function DriverDashboard() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const driverId = "DRV-001"; // Hardcoded for now
  
  const orderId = useMemo(() => pathname.split('/')[2], [pathname]);

  const getOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from a live API.
      // For our demo, we fetch the full mock dataset.
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

  // Fetch initial data when the component mounts
  useEffect(() => {
    if (allOrders.length === 0) {
      getOrders();
    }
  }, [getOrders, allOrders.length]);
  
  // This is the core state management function. It's passed down to children.
  const handleStatusUpdate = useCallback((updatedOrderId: string, newStatus: Order['status'], reason?: string) => {
    setAllOrders(currentOrders => 
        currentOrders.map(order => {
            if (order.id === updatedOrderId) {
                const updatedOrder = { ...order, status: newStatus };
                if (reason) {
                    updatedOrder.returnReason = reason;
                }
                // Set completion timestamp for terminal statuses
                if (newStatus === 'Delivered' || newStatus === 'Returning' || newStatus === 'Cancelled') {
                    updatedOrder.completedAt = new Date().toISOString();
                }
                return updatedOrder;
            }
            return order;
        })
    );
  }, []);


  const { activeOrders, historyOrders, selectedOrder } = useMemo(() => {
    const active = allOrders.filter(
      o => o.status === 'Moving' || o.status === 'Pending'
    ).sort((a, b) => {
        // 'Moving' always comes first
        if (a.status === 'Moving' && b.status !== 'Moving') return -1;
        if (a.status !== 'Moving' && b.status === 'Moving') return 1;
        // Then sort by ID or a priority field
        return a.id.localeCompare(b.id);
      });

    const history = allOrders.filter(
      o => o.status === 'Delivered' || o.status === 'Cancelled' || o.status === 'Returning'
    ).sort((a, b) => {
        // Sort by completion date, descending
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
    
    const selected = orderId ? allOrders.find(o => o.id === orderId) || null : null;

    return { activeOrders: active, historyOrders: history, selectedOrder: selected };
  }, [allOrders, orderId]);

  // If an orderId is present in the URL, show the details page.
  if (orderId) {
    return (
      <OrderDetailsPage 
        order={selectedOrder} 
        onStatusUpdate={handleStatusUpdate}
      />
    );
  }

  // Otherwise, show the main dashboard.
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
                  {isLoading ? <Skeleton className="h-64 w-full" /> : <DriverDeliveries orders={activeOrders} />}
                </TabsContent>
                <TabsContent value="history">
                  {isLoading ? <Skeleton className="h-64 w-full" /> : <DriverOrderHistory orders={historyOrders} />}
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
