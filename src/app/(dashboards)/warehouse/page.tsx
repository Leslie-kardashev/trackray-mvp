
import { WarehouseInventory } from "@/components/warehouse-inventory";
import { WarehousePickups } from "@/components/warehouse-pickups";

export default function WarehouseDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Warehouse Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor inventory levels, track stock movement, and manage costs.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
            <WarehouseInventory />
        </div>
        <div className="xl:col-span-1">
            <WarehousePickups />
        </div>
      </div>
    </div>
  );
}
