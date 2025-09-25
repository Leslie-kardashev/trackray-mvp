
import { WarehouseHistory } from "@/components/warehouse-history";
import { WarehouseDemandForecasting } from "@/components/warehouse-demand-forecasting";

export default function WarehouseReportsPage() {
  return (
    <div className="space-y-8">
        <WarehouseHistory />
        <WarehouseDemandForecasting />
    </div>
  );
}
