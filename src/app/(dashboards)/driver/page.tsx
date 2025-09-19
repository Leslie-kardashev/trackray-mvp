
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { type Order } from '@/lib/types';
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

  useEffect(() => {
    const driverId = "DRV-001"; // Hardcoded for now
    const ordersCollection = collection(db, 'orders');
    // In a real app, you would have the driverId from authentication
    const q = query(ordersCollection, where("driverId", "==", driverId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allOrders.push({ 
          id: doc.id,
          ...data,
          // Convert Firestore Timestamps to ISO strings if they exist
          requestedDeliveryTime: (data.requestedDeliveryTime as Timestamp)?.toDate().toISOString(),
          completedAt: (data.completedAt as Timestamp)?.toDate().toISOString(),
        } as Order);
      });

      const active = allOrders.filter(
        o => o.status === 'Moving' || o.status === 'Pending'
      );

      const history = allOrders.filter(
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
      setIsLoading(false);
    }, (error) => {
      console.error("Failed to fetch driver orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your deliveries. Please check your connection.",
      });
      setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [toast]);


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
        <div className="lg:col-span-1 w-full">
            <DriverSOS />
        </div>
      </div>
    </div>
  );
}
