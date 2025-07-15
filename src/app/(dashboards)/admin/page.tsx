import { AdminDeliveries } from "@/components/admin-deliveries";
import { AdminInventory } from "@/components/admin-inventory";
import { AdminMap } from "@/components/admin-map";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor inventory, track live deliveries, and view fleet locations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
                <AdminMap />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
            <AdminDeliveries />
        </div>
        <div className="lg:col-span-3">
            <AdminInventory />
        </div>
      </div>
    </div>
  );
}
