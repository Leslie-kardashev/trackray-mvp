import { AdminDeliveries } from "@/components/admin-deliveries";
import { AdminInventory } from "@/components/admin-inventory";
import { AdminMap } from "@/components/admin-map";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">HQ Command Center</h1>
        <p className="text-muted-foreground">
          Monitor inventory, track live deliveries, and view fleet locations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <AdminMap />
        </div>
        <div className="lg:col-span-2">
          <AdminDeliveries />
        </div>
        <div className="lg:col-span-5">
            <AdminInventory />
        </div>
      </div>
    </div>
  );
}
