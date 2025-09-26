// This file is repurposed for FinanceKPIs.
"use client";

import { DollarSign, TrendingUp, TrendingDown, Wallet, Users, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FinanceKPIs() {
  const kpis = [
    { title: "Total Revenue (MTD)", value: "GHS 185,231.89", icon: DollarSign, trend: "+8.2%" },
    { title: "Total Expenses (MTD)", value: "GHS 112,450.12", icon: TrendingDown, trend: "+5.1%", color: "text-red-500" },
    { title: "Net Profit", value: "GHS 72,781.77", icon: TrendingUp, trend: "+12.5%" },
    { title: "Cash on Hand", value: "GHS 245,812.50", icon: Wallet },
    { title: "Outstanding Receivables", value: "GHS 98,400.00", icon: Users, color: "text-yellow-600" },
    { title: "Outstanding Payables", value: "GHS 35,200.00", icon: Package, color: "text-orange-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color || ''}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            {kpi.trend && (
              <p className="text-xs text-muted-foreground">
                {kpi.trend} from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Re-exporting with a more specific name for clarity in page.tsx
export { FinanceKPIs };
