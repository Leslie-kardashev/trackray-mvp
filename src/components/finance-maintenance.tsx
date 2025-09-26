// This file is repurposed for FinanceCashflowChart
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const cashflowData = [
  { date: "Week 1", "Cash In": 45000, "Cash Out": 32000 },
  { date: "Week 2", "Cash In": 52000, "Cash Out": 48000 },
  { date: "Week 3", "Cash In": 48000, "Cash Out": 51000 },
  { date: "Week 4", "Cash In": 61000, "Cash Out": 45000 },
  { date: "This Week", "Cash In": 38000, "Cash Out": 42000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
          <p className="font-bold mb-2">{label}</p>
          <p style={{ color: payload[0].color }}>{`${payload[0].name}: GHS ${payload[0].value.toLocaleString()}`}</p>
          <p style={{ color: payload[1].color }}>{`${payload[1].name}: GHS ${payload[1].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

export function FinanceCashflowChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <TrendingUp /> Cash Flow Position
                </CardTitle>
                <CardDescription>
                Cash inflows vs. outflows over the last 5 weeks.
                </CardDescription>
            </div>
            <Alert variant="destructive" className="w-auto max-w-xs bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                Cash outflows have exceeded inflows in 2 of the last 3 weeks.
                </AlertDescription>
            </Alert>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value: number) => `GHS ${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Area type="monotone" dataKey="Cash In" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2), 0.2)" strokeWidth={2} />
                <Area type="monotone" dataKey="Cash Out" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive), 0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
