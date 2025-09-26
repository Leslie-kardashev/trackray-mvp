// This file is repurposed for FinanceSalesAnalytics
"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Users, Package } from "lucide-react";

export function FinanceSalesAnalytics() {
  const topCustomers = [
    { id: 'CUS-102', name: 'Shoprite Accra Mall', revenue: 'GHS 45,800' },
    { id: 'CUS-108', name: 'Melcom Plus', revenue: 'GHS 32,150' },
    { id: 'CUS-112', name: 'Palace Hypermarket', revenue: 'GHS 28,900' },
  ];

  const topProducts = [
    { id: 'ITM-002', name: 'Nido Milk Powder (400g)', unitsSold: '1,250' },
    { id: 'ITM-005', name: 'Ideal Milk (Evaporated, 12-pack)', unitsSold: '980' },
    { id: 'ITM-001', name: 'Milo Cereal (500g)', unitsSold: '850' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <BarChart /> Sales & Revenue Analytics
        </CardTitle>
        <CardDescription>
          Analysis of top-performing customers and products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers"><Users className="mr-2"/>Top Customers</TabsTrigger>
            <TabsTrigger value="products"><Package className="mr-2"/>Top Products</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Revenue (MTD)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topCustomers.map(customer => (
                        <TableRow key={customer.id}>
                            <TableCell className="font-mono">{customer.id}</TableCell>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.revenue}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="products">
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Units Sold (MTD)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topProducts.map(product => (
                        <TableRow key={product.id}>
                            <TableCell className="font-mono">{product.id}</TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.unitsSold}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
