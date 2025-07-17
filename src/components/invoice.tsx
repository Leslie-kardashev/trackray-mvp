
"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { type Order, type Customer } from "@/lib/types";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const paymentStatusStyles: { [key in Order['paymentStatus']]: string } = {
    'Paid': 'border-green-500 bg-green-100 text-green-800',
    'Pay on Credit': 'border-blue-500 bg-blue-100 text-blue-800',
    'Pending': 'border-yellow-500 bg-yellow-100 text-yellow-800',
};

const AppLogo = () => (
    <svg role="img" aria-label="TrackRay Logo" className="w-auto h-8 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="hsl(var(--secondary-foreground))" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export function Invoice({ order, customer }: { order: Order; customer: Customer }) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const input = invoiceRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;

        pdf.addImage(imgData, "PNG", 0, 0, width, height > pdfHeight ? pdfHeight : height);
        pdf.save(`invoice-${order.id}.pdf`);
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toFixed(2)}`;
  };
  
  const subtotal = order.orderValue || 0;
  const taxes = subtotal * 0.15; // 15% VAT
  const total = subtotal + taxes;

  return (
    <div>
        <div ref={invoiceRef} className="bg-background p-8 rounded-lg border text-foreground">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <AppLogo />
                    <h1 className="font-headline text-3xl font-bold text-foreground mt-2">TrackRay Inc.</h1>
                    <p className="text-muted-foreground">Logistics & Fleet Management</p>
                    <p className="text-muted-foreground text-xs">123 Liberation Road, Accra, Ghana</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold uppercase text-muted-foreground tracking-widest">Invoice</h2>
                    <p className="font-mono text-muted-foreground"># {order.id}</p>
                    <p className="text-muted-foreground mt-2">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
            </header>

            <Separator className="my-8" />
            
            <section className="grid grid-cols-2 gap-8 mb-8">
                 <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Bill To</h3>
                    <p className="font-bold text-lg">{customer.name}</p>
                    <p className="text-muted-foreground">{customer.location.address}</p>
                    <p className="text-muted-foreground">{customer.phone}</p>
                    {customer.email && <p className="text-muted-foreground">{customer.email}</p>}
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Payment Status</h3>
                     <Badge variant="outline" className={cn("text-base px-4 py-2 font-bold", paymentStatusStyles[order.paymentStatus])}>
                        {order.paymentStatus}
                     </Badge>
                </div>
            </section>

            <section>
                 <table className="w-full text-left">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 font-semibold">Description</th>
                            <th className="p-3 font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-3">
                                <p className="font-medium">Delivery Service</p>
                                <p className="text-muted-foreground text-sm">{order.item}</p>
                            </td>
                            <td className="p-3 text-right font-mono">{formatCurrency(subtotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            
            <section className="flex justify-end mt-8">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(subtotal)}</span>
                    </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Taxes (15%)</span>
                        <span className="font-mono">{formatCurrency(taxes)}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="font-mono">{formatCurrency(total)}</span>
                    </div>
                </div>
            </section>

            <footer className="mt-12 text-center text-muted-foreground text-xs">
                <p>Thank you for your business!</p>
                <p>If you have any questions, please contact our support team.</p>
            </footer>
        </div>
        <div className="mt-6 flex justify-end">
            <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
            </Button>
      </div>
    </div>
  );
}
