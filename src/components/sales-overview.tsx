
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Package, Users, BarChart, TrendingUp } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const dailyRevenue = [
    { date: "Mon", revenue: 2200 },
    { date: "Tue", revenue: 3100 },
    { date: "Wed", revenue: 1900 },
    { date: "Thu", revenue: 4500 },
    { date: "Fri", revenue: 3800 },
    { date: "Sat", revenue: 5600 },
    { date: "Sun", revenue: 4800 },
];

const weeklyRevenue = [
    { week: "Week 1", revenue: 12000 },
    { week: "Week 2", revenue: 15500 },
    { week: "Week 3", revenue: 14000 },
    { week: "Week 4", revenue: 18500 },
];


export function SalesOverview() {
  const stats = [
    { title: "Total Revenue (Month)", value: "GHS 45,231.89", icon: DollarSign },
    { title: "New Customers (Month)", value: "+23", icon: Users },
    { title: "Orders Created (Week)", value: "120", icon: Package },
    { title: "Delivery Acceptance Rate", value: "98.5%", icon: BarChart },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {label}
              </span>
              <span className="font-bold text-muted-foreground">
                GHS {payload[0].value.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
            <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                {/* You can add comparison data here */}
                </p>
            </CardContent>
            </Card>
        ))}
        </div>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <TrendingUp />
                            Revenue Analytics
                        </CardTitle>
                        <CardDescription>
                            Track revenue performance over time.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="daily">
                    <TabsList className="mb-4">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `GHS ${value / 1000}k`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                                    <Line type="natural" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                    <TabsContent value="weekly">
                         <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `GHS ${value / 1000}k`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                                    <Line type="natural" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
