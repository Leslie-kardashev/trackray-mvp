
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { BrainCircuit } from "lucide-react";

const demandData = [
    { week: "4 Wks Ago", "Milo Cereal (500g)": 400, "Nido Milk Powder (400g)": 240, "Ideal Milk (12-pack)": 150 },
    { week: "3 Wks Ago", "Milo Cereal (500g)": 300, "Nido Milk Powder (400g)": 139, "Ideal Milk (12-pack)": 180 },
    { week: "2 Wks Ago", "Milo Cereal (500g)": 200, "Nido Milk Powder (400g)": 480, "Ideal Milk (12-pack)": 220 },
    { week: "Last Week", "Milo Cereal (500g)": 278, "Nido Milk Powder (400g)": 390, "Ideal Milk (12-pack)": 200 },
    { week: "This Week", "Milo Cereal (500g)": 189, "Nido Milk Powder (400g)": 480, "Ideal Milk (12-pack)": 250 },
    { week: "Next Week", "Milo Cereal (500g)": 239, "Nido Milk Powder (400g)": 380, "Ideal Milk (12-pack)": 280 },
    { week: "In 2 Wks", "Milo Cereal (500g)": 349, "Nido Milk Powder (400g)": 430, "Ideal Milk (12-pack)": 310 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
            <p className="text-sm font-bold mb-2">{label}</p>
            {payload.map((entry: any, index: number) => (
                <p key={index} style={{ color: entry.color }} className="text-xs">
                    {entry.name}: {entry.value} units
                </p>
            ))}
        </div>
      );
    }
    return null;
};

export function WarehouseDemandForecasting() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" /> Demand Forecasting
            </CardTitle>
            <CardDescription>
                AI-powered demand forecast for top-moving products based on historical sales data and market trends.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demandData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} unit=" units" />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        <Line type="monotone" dataKey="Milo Cereal (500g)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="Nido Milk Powder (400g)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }}/>
                        <Line type="monotone" dataKey="Ideal Milk (12-pack)" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
  );
}
