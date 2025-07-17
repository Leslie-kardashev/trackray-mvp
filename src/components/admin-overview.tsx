
"use client";

import { useState, useEffect } from "react";
import { getOrders, getInventory, getCustomers } from "@/lib/data-service";
import { DollarSign, Package, Truck, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminOverview() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        activeDeliveries: 0,
        newCustomers: 0,
        inventoryValue: 0,
    });
    
    useEffect(() => {
        const fetchData = async () => {
            const [orders, inventory, customers] = await Promise.all([getOrders(), getInventory(), getCustomers()]);
            
            const totalRevenue = orders
                .filter(o => o.paymentStatus === 'Paid' && o.orderValue)
                .reduce((sum, o) => sum + (o.orderValue || 0), 0);

            const activeDeliveries = orders.filter(o => ['Moving', 'Idle', 'Returning'].includes(o.status)).length;
            
            const inventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            // This is a placeholder since we don't have customer creation dates.
            // In a real app, you would filter customers by their creation date.
            const newCustomers = customers.length > 5 ? 5 : customers.length; 

            setStats({
                totalRevenue,
                activeDeliveries,
                newCustomers,
                inventoryValue,
            });
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh stats every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { title: "Total Revenue (All Time)", value: `GHS ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign },
        { title: "Active Deliveries", value: stats.activeDeliveries, icon: Truck },
        { title: "New Customers (Month)", value: `+${stats.newCustomers}`, icon: Users },
        { title: "Total Inventory Value", value: `GHS ${stats.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: Package },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
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
    );
}

