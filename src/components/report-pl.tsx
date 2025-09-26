
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Download, FileText } from "lucide-react";

const formatCurrency = (value: number) => `GHS ${value.toLocaleString()}`;

export function ReportPL() {
  const data = {
    revenue: 185231,
    costOfGoodsSold: 98500,
    grossProfit: 86731,
    expenses: {
      salaries: 45000,
      transport: 28000,
      rent: 15000,
      utilities: 8000,
      marketing: 12000,
    },
    totalExpenses: 108000,
    netProfit: -21269,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <FileText /> Profit & Loss Statement
            </CardTitle>
            <CardDescription>
              For the period ending May 31, 2024
            </CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2" /> Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Revenue</TableHead>
              <TableCell className="text-right font-bold font-mono">
                {formatCurrency(data.revenue)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Cost of Goods Sold</TableCell>
              <TableCell className="text-right font-mono">
                ({formatCurrency(data.costOfGoodsSold)})
              </TableCell>
            </TableRow>
            <TableRow className="border-t-2 border-b-2 border-foreground">
              <TableHead className="font-bold">Gross Profit</TableHead>
              <TableCell className="text-right font-bold font-mono">
                {formatCurrency(data.grossProfit)}
              </TableCell>
            </TableRow>
             <TableRow className="bg-muted/50">
              <TableHead colSpan={2} className="font-bold">Operating Expenses</TableHead>
            </TableRow>
            {Object.entries(data.expenses).map(([key, value]) => (
                 <TableRow key={key}>
                    <TableCell className="pl-8 capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                    <TableCell className="text-right font-mono">({formatCurrency(value)})</TableCell>
                </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold pl-8">Total Operating Expenses</TableHead>
              <TableCell className="text-right font-bold font-mono">
                ({formatCurrency(data.totalExpenses)})
              </TableCell>
            </TableRow>
             <TableRow className="border-t-2 border-b-2 border-foreground">
              <TableHead className="font-bold text-xl">Net Profit</TableHead>
              <TableCell className={`text-right font-bold font-mono text-xl ${data.netProfit < 0 ? 'text-destructive' : 'text-green-600'}`}>
                {formatCurrency(data.netProfit)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
