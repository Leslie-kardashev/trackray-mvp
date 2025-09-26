import { FinanceKPIs } from "@/components/finance-kpis";
import { FinanceCashflowChart } from "@/components/finance-cashflow-chart";
import { FinanceSalesAnalytics } from "@/components/finance-sales-analytics";
import { FinanceExpenseChart } from "@/components/finance-expense-chart";
import { FinanceRecentVouchers } from "@/components/finance-recent-vouchers";
import { FinanceAIAssistant } from "@/components/finance-ai-assistant";

export default function FinanceDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Financial Command Center</h1>
        <p className="text-muted-foreground">
          Your AI-powered command center for Tally financial data.
        </p>
      </div>

      <FinanceKPIs />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-8">
          <FinanceCashflowChart />
          <FinanceSalesAnalytics />
          <FinanceExpenseChart />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <div className="sticky top-24 space-y-8">
            <FinanceAIAssistant />
            <FinanceRecentVouchers />
          </div>
        </div>
      </div>
    </div>
  );
}
