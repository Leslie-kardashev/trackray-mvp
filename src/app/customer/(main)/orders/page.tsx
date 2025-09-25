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
    </div>
  );
}
