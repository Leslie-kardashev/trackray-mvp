
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AlertTriangle, PieChart as PieChartIcon } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const expenseData = [
  { name: 'Salaries', value: 45000, color: 'hsl(var(--chart-1))' },
  { name: 'Transport', value: 28000, color: 'hsl(var(--chart-2))' },
  { name: 'Rent', value: 15000, color: 'hsl(var(--chart-3))' },
  { name: 'Utilities', value: 8000, color: 'hsl(var(--chart-4))' },
  { name: 'Marketing', value: 12000, color: 'hsl(var(--chart-5))' },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
          <p className="font-bold">{data.name}</p>
          <p>{`GHS ${data.value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

export function FinanceExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <PieChartIcon /> Expenses by Category
        </CardTitle>
        <CardDescription>
          Breakdown of major cost centers for the current month.
        </CardDescription>
         <Alert className="w-auto max-w-md bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              AI Insight: Transport costs spiked 60% compared to last month due to increased fuel prices.
            </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                        data={expenseData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {expenseData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
