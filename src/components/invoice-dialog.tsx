
"use client";

import { useState, useEffect } from "react";
import { getOrderById, getCustomerById } from "@/lib/data-service";
import { type Order, type Customer } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Invoice } from "./invoice";
import { Skeleton } from "./ui/skeleton";

export function InvoiceDialog({ orderId, open, onOpenChange }: { orderId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId && open) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const fetchedOrder = await getOrderById(orderId);
                    if (fetchedOrder) {
                        setOrder(fetchedOrder);
                        const fetchedCustomer = await getCustomerById(fetchedOrder.customerId);
                        if (fetchedCustomer) {
                            setCustomer(fetchedCustomer);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch invoice data:", error);
                    setOrder(null);
                    setCustomer(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [orderId, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Invoice Details</DialogTitle>
                    <DialogDescription>
                        Review the invoice below. You can download it as a PDF.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[70vh] overflow-y-auto p-1">
                   {isLoading ? (
                       <div className="space-y-4">
                           <Skeleton className="h-12 w-1/3" />
                           <div className="flex justify-between">
                               <Skeleton className="h-24 w-1/4" />
                               <Skeleton className="h-24 w-1/4" />
                           </div>
                           <Skeleton className="h-32 w-full" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                   ) : order && customer ? (
                       <Invoice order={order} customer={customer} />
                   ) : (
                       <p className="text-center text-muted-foreground">Could not load invoice details.</p>
                   )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
