
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Picklist } from "./picklist";
import { type Order } from "@/lib/types";

export function PicklistDialog({ order, open, onOpenChange }: { order: Order, open: boolean, onOpenChange: (open: boolean) => void }) {
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Picklist for Order #{order.id}</DialogTitle>
                    <DialogDescription>
                        Use this list to collect all items for the order. You can download it as a PDF.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[70vh] overflow-y-auto p-1">
                   {order ? (
                       <Picklist order={order} />
                   ) : (
                       <p className="text-center text-muted-foreground">Could not load picklist details.</p>
                   )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
