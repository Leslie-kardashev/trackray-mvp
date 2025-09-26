
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { proposeVoucherCorrection } from "@/ai/flows/propose-voucher-correction";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { List, Search, Edit, FileDown, AlertCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// Mock data, to be replaced by API calls to SQLite mirror
const mockVouchers = [
    { id: 'VCH-00451', date: '2024-05-28', type: 'Payment', narration: 'Salary for May 2024', amount: '45000.00', anomaly: false },
    { id: 'VCH-00452', date: '2024-05-28', type: 'Sales', narration: 'Sales to Shoprite Accra', amount: '12500.00', anomaly: false },
    { id: 'VCH-00453', date: '2024-05-27', type: 'Purchase', narration: 'Fuel from Goil (Accra)', amount: '500000.00', anomaly: true, anomalyReason: 'Amount is 100x higher than typical fuel purchases.' },
    { id: 'VCH-00454', date: '2024-05-27', type: 'Receipt', narration: 'Payment from Melcom', amount: '20000.00', anomaly: false },
    { id: 'VCH-00455', date: '2024-05-26', type: 'Journal', narration: 'Depreciation Adjustment', amount: '1800.00', anomaly: false },
];
type Voucher = typeof mockVouchers[0];

const correctionSchema = z.object({
  correction: z.string().min(3, "Please describe the correction."),
});
type CorrectionFormValues = z.infer<typeof correctionSchema>;


function EditVoucherDialog({ voucher, onCorrectionProposed, closeDialog }: { voucher: Voucher, onCorrectionProposed: (xml: string) => void; closeDialog: () => void }) {
  const { toast } = useToast();
  const form = useForm<CorrectionFormValues>({ resolver: zodResolver(correctionSchema) });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedXml, setGeneratedXml] = useState<string | null>(null);

  async function onSubmit(values: CorrectionFormValues) {
    setIsLoading(true);
    setGeneratedXml(null);
    try {
      const response = await proposeVoucherCorrection({
        voucherId: voucher.id,
        currentNarration: voucher.narration,
        currentAmount: voucher.amount,
        requestedChange: values.correction,
      });
      setGeneratedXml(response.tallyXml);
      toast({ title: "XML Generated", description: "Tally XML for the correction has been generated." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Could not generate correction XML." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleApply = () => {
    if (generatedXml) {
        onCorrectionProposed(generatedXml);
        closeDialog();
    }
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Propose Correction for Voucher {voucher.id}</DialogTitle>
        <DialogDescription>Use plain English to describe the change. The AI will generate the required Tally XML.</DialogDescription>
      </DialogHeader>
      <div className="text-sm space-y-2">
        <p><strong className="text-muted-foreground">Current Narration:</strong> {voucher.narration}</p>
        <p><strong className="text-muted-foreground">Current Amount:</strong> GHS {voucher.amount}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="correction" render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Change</FormLabel>
              <FormControl><Textarea placeholder="e.g., 'Change narration to Fuel from Goil (Tema)' or 'Update amount to 5000.00'" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>{isLoading ? "Generating..." : "Generate Tally XML"}</Button>
        </form>
      </Form>
      {generatedXml && (
        <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Generated Tally Import XML:</h3>
            <ScrollArea className="h-48 rounded-md border bg-muted p-4 font-mono text-xs">
                <pre>{generatedXml}</pre>
            </ScrollArea>
            <DialogFooter className="pt-2">
                <Button onClick={handleApply}>Apply Correction</Button>
            </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}


export function TallyVoucherManager() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const { toast } = useToast();
  const tableRef = useRef(null);

  const fetchVouchers = useCallback(async () => {
    // In a real app, this would fetch from the SQLite mirror API
    // For now, we use mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    setVouchers(mockVouchers.sort((a,b) => b.id.localeCompare(a.id)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchVouchers();
    // const interval = setInterval(fetchVouchers, 5000); // Poll every 5s
    // return () => clearInterval(interval);
  }, [fetchVouchers]);

  const handleCorrectionProposed = (xml: string) => {
    console.log("Applying Tally XML:", xml);
    // Here you would have an API call to your backend to send this XML to Tally
    toast({ title: "Correction Applied", description: "The voucher has been updated in Tally." });
    // Optimistically update the UI or refetch
    fetchVouchers();
  };
  
  const filteredVouchers = vouchers.filter(v => 
    v.id.toLowerCase().includes(filter.toLowerCase()) || 
    v.narration.toLowerCase().includes(filter.toLowerCase())
  );
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    (doc as any).autoTable({ html: '#vouchers-table' });
    doc.save('vouchers.pdf');
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Date,Type,Narration,Amount\n";
    filteredVouchers.forEach(v => {
        csvContent += `${v.id},${v.date},${v.type},"${v.narration}",${v.amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vouchers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const typeStyles: { [key: string]: string } = {
    'Payment': 'bg-red-100 text-red-800',
    'Sales': 'bg-green-100 text-green-800',
    'Purchase': 'bg-yellow-100 text-yellow-800',
    'Receipt': 'bg-blue-100 text-blue-800',
    'Journal': 'bg-gray-100 text-gray-800',
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <List /> Live Voucher Stream
              </CardTitle>
              <CardDescription>
                A real-time feed of transactions from Tally, with AI-powered anomaly detection.
              </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToPDF}><FileDown className="mr-2" />PDF</Button>
                <Button variant="outline" size="sm" onClick={exportToCSV}><FileDown className="mr-2" />CSV</Button>
            </div>
          </div>
           <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by ID or narration..." 
                    className="w-full pl-8"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px]">
            <table className="w-full" id="vouchers-table">
                <thead className="sticky top-0 bg-card">
                    <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Narration</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                    </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-4"><Skeleton className="h-8 w-16" /></td>
                      </tr>
                    ))
                  ) : filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 align-middle font-mono text-xs">{voucher.id}</td>
                      <td className="p-4 align-middle"><Badge variant="outline" className={typeStyles[voucher.type]}>{voucher.type}</Badge></td>
                      <td className="p-4 align-middle text-xs">
                          {voucher.narration}
                          {voucher.anomaly && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertCircle className="inline-block ml-2 h-4 w-4 text-destructive" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs max-w-xs">{voucher.anomalyReason}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                          )}
                      </td>
                      <td className="p-4 align-middle font-mono text-xs text-right">GHS {parseFloat(voucher.amount).toLocaleString()}</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="outline" size="sm" onClick={() => setEditingVoucher(voucher)}><Edit className="mr-2" /> Propose Fix</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
      {editingVoucher && (
        <Dialog open={!!editingVoucher} onOpenChange={(open) => !open && setEditingVoucher(null)}>
            <EditVoucherDialog
                voucher={editingVoucher}
                onCorrectionProposed={handleCorrectionProposed}
                closeDialog={() => setEditingVoucher(null)}
            />
        </Dialog>
      )}
    </>
  );
}
