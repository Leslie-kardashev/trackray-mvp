
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
import { Badge } from "./ui/badge";
import { List } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function FinanceRecentVouchers() {
    const vouchers = [
        { id: 'VCH-00451', date: '2024-05-28', type: 'Payment', narration: 'Salary for May 2024', amount: 'GHS 45,000.00' },
        { id: 'VCH-00450', date: '2024-05-28', type: 'Sales', narration: 'Sales to Shoprite Accra', amount: 'GHS 12,500.00' },
        { id: 'VCH-00449', date: '2024-05-27', type: 'Purchase', narration: 'Fuel from Goil', amount: 'GHS 5,000.00' },
        { id: 'VCH-00448', date: '2024-05-27', type: 'Receipt', narration: 'Payment from Melcom', amount: 'GHS 20,000.00' },
        { id: 'VCH-00447', date: '2024-05-26', type: 'Journal', narration: 'Depreciation Adjustment', amount: 'GHS 1,800.00' },
    ];

    const typeStyles: { [key: string]: string } = {
        'Payment': 'bg-red-100 text-red-800',
        'Sales': 'bg-green-100 text-green-800',
        'Purchase': 'bg-yellow-100 text-yellow-800',
        'Receipt': 'bg-blue-100 text-blue-800',
        'Journal': 'bg-gray-100 text-gray-800',
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <List /> Latest Vouchers
        </CardTitle>
        <CardDescription>
          A live feed of the most recent transactions from Tally.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Voucher ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                    <TableCell className="font-mono text-xs">{voucher.id}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={typeStyles[voucher.type]}>
                            {voucher.type}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{voucher.narration}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{voucher.amount}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
