
"use client";

import { WarehouseInventory } from "@/components/warehouse-inventory";
import { WarehousePickups } from "@/components/warehouse-pickups";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Package, PackageCheck, AlertTriangle, TrendingUp } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const dailyFulfillment = [
    { date: "Mon", fulfilled: 92, target: 95 },
    { date: "Tue", fulfilled: 94, target: 95 },
    { date: "Wed", fulfilled: 88, target: 95 },
    { date: "Thu", fulfilled: 96, target: 95 },
    { date: "Fri", fulfilled: 97, target: 95 },
    { date: "Sat", fulfilled: 99, target: 95 },
    { date: "Sun", fulfilled: 95, target: 95 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-bold mb-1">{label}</p>
          <p className="text-xs text-blue-500">Fulfilled: {payload[0].value}%</p>
          <p className="text-xs text-gray-400">Target: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };


export default function WarehouseDashboard() {
    const stats = [
        { title: "Orders to Pack", value: "82", icon: Package },
        { title: "Ready for Dispatch", value: "35", icon: PackageCheck },
        { title: "Stockout Risks", value: "4", icon: AlertTriangle, color: "text-destructive" },
        { title: "Inventory Value", value: "GHS 1,280,450", icon: DollarSign },
    ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Warehouse Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of inventory, orders, and fulfillment performance.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color || ''}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {/* Comparison data can be added here */}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <TrendingUp /> Daily Fulfillment Performance
                    </CardTitle>
                    <CardDescription>
                        Percentage of orders fulfilled on time vs. target.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyFulfillment}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                                <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} unit="%" />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                                <Line type="monotone" dataKey="fulfilled" name="Fulfilled" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Tabs defaultValue="pickups">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pickups">Awaiting Pickup</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory Levels</TabsTrigger>
                </TabsList>
                <TabsContent value="pickups" className="mt-4">
                    <WarehousePickups />
                </TabsContent>
                <TabsContent value="inventory" className="mt-4">
                    <WarehouseInventory />
                </TabsContent>
            </Tabs>
        </div>
      </div>

    </div>
  );
}
