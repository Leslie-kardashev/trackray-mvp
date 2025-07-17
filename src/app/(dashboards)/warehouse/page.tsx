
import { WarehouseInventory } from "@/components/warehouse-inventory";
import { WarehousePickups } from "@/components/warehouse-pickups";
import { WarehouseHistory } from "@/components/warehouse-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function WarehouseDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Warehouse Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor inventory, manage active pickups, and view order history.
        </p>
      </div>

      <Tabs defaultValue="live">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Operations</TabsTrigger>
            <TabsTrigger value="history">Pickup History</TabsTrigger>
        </TabsList>
        <TabsContent value="live">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <WarehouseInventory />
                </div>
                <div className="xl:col-span-1">
                    <WarehousePickups />
                </div>
            </div>
        </TabsContent>
        <TabsContent value="history">
            <WarehouseHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
