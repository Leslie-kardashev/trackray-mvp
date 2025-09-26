
import { FinanceDeliveriesOverview } from "@/components/finance-deliveries-overview";
import { FinanceMaintenance } from "@/components/finance-maintenance";
import { FinanceVehicleEfficiency } from "@/components/finance-vehicle-efficiency";

export default function FinanceDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Finance Terminal</h1>
        <p className="text-muted-foreground">
          Your AI-powered command center for TallyPrime financial data.
        </p>
      </div>

      <div className="space-y-8">
        <FinanceDeliveriesOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FinanceMaintenance />
            <FinanceVehicleEfficiency />
        </div>
      </div>
    </div>
  );
}
