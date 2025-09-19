
'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Order } from '@/lib/types';
import { fetchAllOrders } from '@/lib/data-service';
import { DriverDeliveries } from "@/components/driver-deliveries";
import { DriverOrderHistory } from "@/components/driver-order-history";
import { DriverSOS } from "@/components/driver-sos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, History } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function DriverDashboard() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const driverId = "DRV-001"; // Hardcoded for now

  const getOrders = useCallback(async () => {
    console.log('Fetching orders...');
    setIsLoading(true);
    try {
      const allOrders = await fetchAllOrders(); // Using the server action
      
      const driverOrders = allOrders.filter(o => o.driverId === driverId);

      const active = driverOrders.filter(
        o => o.status === 'Moving' || o.status === 'Pending'
      );

      const history = driverOrders.filter(
        o => o.status === 'Delivered' || o.status === 'Cancelled' || o.status === 'Returning'
      );

      const sortedActive = active.sort((a, b) => {
        if (a.status === 'Moving' && b.status !== 'Moving') return -1;
        if (a.status !== 'Moving' && b.status === 'Moving') return 1;
        return a.id.localeCompare(b.id);
      });

      const sortedHistory = history.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });

      setActiveOrders(sortedActive);
      setHistoryOrders(sortedHistory);
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
                        <ListTodo className="mr-2 h-4 w-4" /> Active Deliveries
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" /> Order History
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
