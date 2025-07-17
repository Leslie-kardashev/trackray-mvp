import { AdminDeliveries } from "@/components/admin-deliveries";
import { AdminInventory } from "@/components/admin-inventory";
import { AdminMap } from "@/components/admin-map";
import { AdminOverview } from "@/components/admin-overview";
import { AdminSosAlerts } from "@/components/admin-sos-alerts";
import { FinanceDeliveriesOverview } from "@/components/finance-deliveries-overview";
import { SalesOverview } from "@/components/sales-overview";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">HQ Command Center</h1>
        <p className="text-muted-foreground">
          A top-level overview of all logistics and business operations.
        </p>
      </div>

      <AdminOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="fleet">
                <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fleet">Fleet & Deliveries</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="sales">Sales & Finance</TabsTrigger>
                </TabsList>
                <TabsContent value="fleet">
                <Card>
                    <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                        <div className="xl:col-span-3">
                        <AdminMap />
                        </div>
                        <div className="xl:col-span-2">
                        <AdminDeliveries />
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>
                <TabsContent value="inventory">
                <AdminInventory />
                </TabsContent>
                <TabsContent value="sales" className="space-y-6">
                    <SalesOverview />
                    <FinanceDeliveriesOverview />
                </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1">
            <AdminSosAlerts />
        </div>
      </div>
    </div>
  );
}
