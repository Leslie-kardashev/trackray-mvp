<<<<<<< HEAD

'use client';

import { useContext, useMemo } from 'react';
import { AppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrdersList } from '@/components/customer/orders-list';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const { orders } = useContext(AppContext);

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === 'Pending Assignment' || order.status === 'Out for Delivery'
      ),
    [orders]
  );

  const pastOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === 'Delivered' || order.status === 'Cancelled'
      ),
    [orders]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">My Orders</h1>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeOrders.length > 0 ? (
            <OrdersList orders={activeOrders} />
          ) : (
            <div className="text-center space-y-4 py-16">
                <Package className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No Active Orders</h2>
                <p className="text-muted-foreground">Your active deliveries will appear here.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history">
          {pastOrders.length > 0 ? (
            <OrdersList orders={pastOrders} />
          ) : (
            <div className="text-center space-y-4 py-16">
                <Package className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No Order History</h2>
                <p className="text-muted-foreground">Your completed or cancelled orders will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
=======
// This is a placeholder for the Orders page.
// We will implement the content in the next step.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="font-headline text-3xl font-bold">My Orders</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Active and past orders will be implemented here.</p>
        </CardContent>
      </Card>
>>>>>>> 95ac1cf (Good Start)
    </div>
  );
}
