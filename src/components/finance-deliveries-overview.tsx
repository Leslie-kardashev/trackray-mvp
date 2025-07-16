
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { FileDown } from "lucide-react";

export function FinanceDeliveriesOverview() {
  // This would come from your data service
  const deliveries = [
    { id: 'ORD-101', customer: 'Customer 101', driver: 'Driver A', value: 'GHS 500', date: '2024-05-22', status: 'Completed', payment: 'Paid' },
    { id: 'ORD-102', customer: 'Customer 102', driver: 'Driver B', value: 'GHS 1,200', date: '2024-05-23', status: 'Completed', payment: 'Delayed Payment' },
    { id: 'ORD-103', customer: 'Customer 103', driver: 'Driver C', value: 'GHS 350', date: '2024-05-24', status: 'Pending', payment: 'Pending' },
  ];

  const paymentStatusStyles: { [key: string]: string } = {
    'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Delayed Payment': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Issue with Payment': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Deliveries Financial Overview</CardTitle>
                <CardDescription>View and manage financial data for all deliveries.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input placeholder="Filter by customer, value..." className="w-64" />
                <Button variant="outline">
                    <FileDown className="mr-2" />
                    Export to CSV
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delivery ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Order Value</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="font-mono">{delivery.id}</TableCell>
                <TableCell>{delivery.customer}</TableCell>
                <TableCell>{delivery.driver}</TableCell>
                <TableCell>{delivery.value}</TableCell>
                <TableCell>{delivery.date}</TableCell>
                <TableCell>{delivery.status}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={paymentStatusStyles[delivery.payment]}>
                    {delivery.payment}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
