
"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { type Order } from "@/lib/types";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Download, CheckSquare } from "lucide-react";

const AppLogo = () => (
    <svg role="img" aria-label="TrackRay Logo" className="w-auto h-8 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="hsl(var(--secondary-foreground))" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export function Picklist({ order }: { order: Order; }) {
  const picklistRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const input = picklistRef.current;
    if (input) {
      // Temporarily remove the download button from the PDF
      const button = input.querySelector('[data-id="download-button"]');
      if (button) button.classList.add('hidden');

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
        pdf.save(`picklist-${order.id}.pdf`);
        
        // Restore the button
        if (button) button.classList.remove('hidden');
      });
    }
  };

  const getAisle = (itemName: string) => {
      // Simple logic to assign an aisle based on item name
      const hash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const aisle = (hash % 12) + 1;
      const shelf = String.fromCharCode(65 + (hash % 5)); // A-E
      return `Aisle ${aisle}, Shelf ${shelf}`;
  }


  return (
    <div>
        <div ref={picklistRef} className="bg-background p-8 rounded-lg border text-foreground">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold text-foreground mt-2">Picking List</h1>
                    <p className="text-muted-foreground">Generated on: {new Date().toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase text-muted-foreground tracking-widest">Order ID</h2>
                    <p className="font-mono text-xl text-foreground">{order.id}</p>
                </div>
            </header>

            <Separator className="my-8" />
            
            <section className="space-y-1 mb-8">
                <p><span className="font-semibold text-muted-foreground">Customer:</span> <span className="font-bold">{order.customerName}</span></p>
                <p><span className="font-semibold text-muted-foreground">Destination:</span> {order.destination.address}</p>
                 {order.driverName && <p><span className="font-semibold text-muted-foreground">Driver:</span> {order.driverName} ({order.driverVehicleId})</p>}
            </section>

            <section>
                 <table className="w-full text-left">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 font-semibold w-16">Picked</th>
                            <th className="p-3 font-semibold">Product Name</th>
                            <th className="p-3 font-semibold text-center w-24">Quantity</th>
                            <th className="p-3 font-semibold w-40">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3 align-middle text-center">
                                    <div className="w-6 h-6 border-2 border-foreground rounded-sm mx-auto"></div>
                                </td>
                                <td className="p-3 font-medium">
                                    {item.name}
                                </td>
                                <td className="p-3 text-center font-bold text-xl font-mono">{item.quantity}</td>
                                <td className="p-3 font-mono">{getAisle(item.name)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            <footer className="mt-12 text-center text-muted-foreground text-xs">
                <p>Please ensure all items are picked accurately and report any discrepancies.</p>
            </footer>
        </div>
        <div className="mt-6 flex justify-end" data-id="download-button">
            <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
            </Button>
      </div>
    </div>
  );
}
