import { DriverDeliveries } from "@/components/driver-deliveries";
import { RouteOptimizer } from "@/components/route-optimizer";

export default function DriverDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your deliveries and use the Route AI for optimization.
        </p>
      </div>

      <DriverDeliveries />
      <RouteOptimizer />
    </div>
  );
}
