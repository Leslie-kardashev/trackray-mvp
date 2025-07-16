
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, Users, BarChart } from "lucide-react";

export function SalesOverview() {
  const stats = [
    { title: "Total Revenue (Month)", value: "GHS 45,231.89", icon: DollarSign },
    { title: "New Customers (Month)", value: "+23", icon: Users },
    { title: "Orders Created (Week)", value: "120", icon: Package },
    { title: "Delivery Acceptance Rate", value: "98.5%", icon: BarChart },
  ];

  return (
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
  );
}
