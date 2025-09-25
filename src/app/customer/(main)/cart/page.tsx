<<<<<<< HEAD

'use client';

import { useContext, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItemDisplay } from '@/components/customer/cart-item-display';
import { OrderSummary } from '@/components/customer/order-summary';
import { DeliveryDetails } from '@/components/customer/delivery-details';
import { Location, Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, user, placeOrder } = useContext(AppContext);
  const router = useRouter();
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(
    user?.shopLocation || null
  );
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
    new Date()
  );
  const [paymentPreference, setPaymentPreference] = useState<
    'Prepaid' | 'Pay On Credit'
  >('Prepaid');

  const subtotal = cart.reduce((acc, item) => {
    const price = item.variant ? item.variant.unitPrice : item.product.unitPrice || 0;
    return acc + price * item.quantity;
  }, 0);

  const discount = user?.type === 'Business' ? subtotal * 0.1 : 0;
  
  const deliveryFee = useMemo(() => {
    if (deliveryLocation?.address.toLowerCase().includes('kumasi')) {
      return 0;
    }
    return 20; // Standard delivery fee
  }, [deliveryLocation]);

  const total = subtotal - discount + deliveryFee;

  const handlePlaceOrder = () => {
    if (!user || !deliveryLocation || !deliveryDate) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please ensure all delivery details are complete.',
      });
      return;
    }

    const newOrder: Omit<Order, 'id' | 'userId' | 'orderDate'> = {
      items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          priceAtOrder: item.variant ? item.variant.unitPrice : item.product.unitPrice || 0,
          variant: item.variant,
      })),
      totalAmount: total,
      status: 'Pending Assignment',
      deliveryAddress: deliveryLocation,
      scheduledDeliveryDate: deliveryDate.toISOString(),
      paymentPreference: paymentPreference,
    };

    placeOrder(newOrder);

    toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase. You can track your order in the "My Orders" page.'
    });

    router.push('/customer/orders');
  };

  if (!apiKey) {
    return (
     <div className="container mx-auto p-4">
       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
         <strong className="font-bold">Configuration Error:</strong>
         <span className="block sm:inline"> The Google Maps API Key is missing. Please add it to your .env file to enable map features.</span>
       </div>
     </div>
   );
}

  if (cart.length === 0) {
    return (
        <div className="text-center space-y-4 pt-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
            <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
                <Link href="/customer/dashboard">Start Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">My Cart</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <CartItemDisplay />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <APIProvider apiKey={apiKey}>
                <DeliveryDetails
                  user={user}
                  deliveryLocation={deliveryLocation}
                  setDeliveryLocation={setDeliveryLocation}
                  deliveryDate={deliveryDate}
                  setDeliveryDate={setDeliveryDate}
                  paymentPreference={paymentPreference}
                  setPaymentPreference={setPaymentPreference}
                />
              </APIProvider>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <OrderSummary
                    subtotal={subtotal}
                    discount={discount}
                    deliveryFee={deliveryFee}
                    total={total}
                />
            </CardContent>
          </Card>

          <Button onClick={handlePlaceOrder} className="w-full h-12 text-lg font-bold">
            Place Order
          </Button>
        </div>
      </div>
=======
// This is a placeholder for the Cart page.
// We will implement the content in the next step.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="font-headline text-3xl font-bold">My Cart</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cart Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cart items and order summary will be implemented here.</p>
        </CardContent>
      </Card>
>>>>>>> 95ac1cf (Good Start)
    </div>
  );
}
