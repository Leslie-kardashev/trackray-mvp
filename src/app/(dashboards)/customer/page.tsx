
import { CustomerOrders } from "@/components/customer-orders";
import { CustomerProfile } from "@/components/customer-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Customer Center</h1>
        <p className="text-muted-foreground">
          Submit new orders, track your deliveries, and manage your profile.
        </p>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <CustomerOrders />
        </TabsContent>
        <TabsContent value="profile">
          <CustomerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    