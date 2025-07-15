import { AdminDeliveries } from "@/components/admin-deliveries";
import { AdminInventory } from "@/components/admin-inventory";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor inventory and track live deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AdminInventory />
        <AdminDeliveries />
      </div>
    </div>
  );
}
