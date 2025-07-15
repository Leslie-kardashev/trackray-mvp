import { RouteOptimizer } from "@/components/route-optimizer";

export default function DriverDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground">
          Use the Route AI to get the fastest, most efficient route.
        </p>
      </div>

      <RouteOptimizer />
    </div>
  );
}
