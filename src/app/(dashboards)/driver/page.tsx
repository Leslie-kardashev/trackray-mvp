import { DriverDeliveries } from "@/components/driver-deliveries";
import { DriverSOS } from "@/components/driver-sos";
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <DriverDeliveries />
            <RouteOptimizer />
        </div>
        <div className="lg:col-span-1">
            <DriverSOS />
        </div>
      </div>
    </div>
  );
}
