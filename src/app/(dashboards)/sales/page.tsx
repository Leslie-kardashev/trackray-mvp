
import { SalesCustomerManager } from "@/components/sales-customer-manager";
import { SalesOrderManager } from "@/components/sales-order-manager";
import { SalesOverview } from "@/components/sales-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SalesDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Sales Hub</h1>
        <p className="text-muted-foreground">
          Onboard customers, create orders, and track your sales performance.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customer Management</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <SalesOverview />
        </TabsContent>
        <TabsContent value="customers">
          <SalesCustomerManager />
        </TabsContent>
        <TabsContent value="orders">
          <SalesOrderManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
