
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
import { Button } from "./ui/button";
import { Download, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const ageingData = [
  { customer: "Shoprite Accra Mall", invoiceId: "INV-00123", amount: 15200, daysOverdue: 5, bucket: "1-30" },
  { customer: "Melcom Plus", invoiceId: "INV-00119", amount: 8500, daysOverdue: 35, bucket: "31-60" },
  { customer: "Palace Hypermarket", invoiceId: "INV-00115", amount: 21300, daysOverdue: 12, bucket: "1-30" },
  { customer: "Maxmart", invoiceId: "INV-00102", amount: 5600, daysOverdue: 92, bucket: "90+" },
  { customer: "Koala Shopping Center", invoiceId: "INV-00118", amount: 11250, daysOverdue: 45, bucket: "31-60" },
];

const bucketTotals = {
    "current": 45800,
    "1-30": 36500,
    "31-60": 19750,
    "61-90": 0,
    "90+": 5600,
    "total": 107650
}

const formatCurrency = (value: number) => `GHS ${value.toLocaleString()}`;

const getBucketClass = (bucket: string) => {
    switch(bucket) {
        case '31-60': return 'bg-yellow-100 text-yellow-800';
        case '61-90': return 'bg-orange-100 text-orange-800';
        case '90+': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export function ReportAgeing() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Clock /> Accounts Receivable Ageing
            </CardTitle>
            <CardDescription>
              Breakdown of unpaid customer invoices by due date.
            </CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2" /> Export PDF
          </Button>
        </div>
         <Alert variant="destructive" className="mt-4 max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
                You have <strong>{formatCurrency(5600)}</strong> in invoices overdue by more than 90 days. Prioritize collecting from Maxmart.
            </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Days Overdue</TableHead>
              <TableHead>Ageing Bucket</TableHead>
              <TableHead className="text-right">Amount Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ageingData.map((row) => (
              <TableRow key={row.invoiceId}>
                <TableCell className="font-medium">{row.customer}</TableCell>
                <TableCell className="font-mono">{row.invoiceId}</TableCell>
                <TableCell>{row.daysOverdue}</TableCell>
                <TableCell>
                    <Badge className={getBucketClass(row.bucket)}>{row.bucket} days</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(row.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8">
            <h3 className="font-bold text-lg mb-2">Ageing Summary</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bucket</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow><TableCell>Current</TableCell><TableCell className="text-right font-mono">{formatCurrency(bucketTotals.current)}</TableCell></TableRow>
                    <TableRow><TableCell>1-30 Days</TableCell><TableCell className="text-right font-mono">{formatCurrency(bucketTotals["1-30"])}</TableCell></TableRow>
                    <TableRow><TableCell>31-60 Days</TableCell><TableCell className="text-right font-mono">{formatCurrency(bucketTotals["31-60"])}</TableCell></TableRow>
                    <TableRow><TableCell>61-90 Days</TableCell><TableCell className="text-right font-mono">{formatCurrency(bucketTotals["61-90"])}</TableCell></TableRow>
                     <TableRow className="font-bold bg-destructive/10"><TableCell>90+ Days</TableCell><TableCell className="text-right font-mono">{formatCurrency(bucketTotals["90+"])}</TableCell></TableRow>
                    <TableRow className="border-t-2 border-foreground"><TableHead className="font-bold">Total Receivables</TableHead><TableCell className="text-right font-bold font-mono">{formatCurrency(bucketTotals.total)}</TableCell></TableRow>
                </TableBody>
            </Table>
        </div>

      </CardContent>
    </Card>
  );
}
