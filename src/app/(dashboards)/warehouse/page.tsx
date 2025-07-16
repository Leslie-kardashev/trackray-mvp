
import { WarehouseInventory } from "@/components/warehouse-inventory";

export default function WarehouseDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Warehouse Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor inventory levels, track stock movement, and manage costs.
        </p>
      </div>

      <WarehouseInventory />
    </div>
  );
}
