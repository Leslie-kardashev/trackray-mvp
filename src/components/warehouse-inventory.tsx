
"use client";

import { useState, useEffect } from "react";
import { getInventory, addInventoryItem, updateInventoryItem, addInboundTransfer } from "@/lib/data-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { PlusCircle, ArrowDownLeft, MoreHorizontal, Edit, XCircle } from "lucide-react";
import { type InventoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const statusStyles: { [key in InventoryItem['status']]: string } = {
  'In Stock': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Low Stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Inbound': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Outbound': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Discontinued': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
};

const itemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters."),
  category: z.string().min(2, "Category is required."),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative."),
  unitCost: z.coerce.number().min(0.01, "Unit cost must be positive."),
  minThreshold: z.coerce.number().min(0, "Threshold cannot be negative."),
  weight: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

function InventoryItemForm({ 
    defaultValues,
    onSubmit,
    closeDialog 
}: { 
    defaultValues?: Partial<ItemFormValues>;
    onSubmit: (values: ItemFormValues) => Promise<void>; 
    closeDialog: () => void 
}) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: defaultValues || {
      name: "",
      category: "",
      quantity: 0,
      unitCost: 0,
      minThreshold: 10,
      weight: "",
    },
  });

  const handleFormSubmit = async (values: ItemFormValues) => {
    await onSubmit(values);
    form.reset();
    closeDialog();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input placeholder="e.g., Kente Cloth Rolls" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., FMCG" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem><FormLabel>Current Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="unitCost" render={({ field }) => (
                <FormItem><FormLabel>Unit Cost (GHS)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="minThreshold" render={({ field }) => (
                <FormItem><FormLabel>Low Stock Threshold</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem><FormLabel>Weight (Optional)</FormLabel><FormControl><Input placeholder="e.g., 5 kg" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Item"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const inboundSchema = z.object({
  itemId: z.string({ required_error: "Please select an item." }),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  arrivalDate: z.string().min(1, "Please provide an estimated arrival date."),
});

type InboundFormValues = z.infer<typeof inboundSchema>;

function InboundTransferDialog({ inventoryItems, onTransferCreated, closeDialog }: { inventoryItems: InventoryItem[], onTransferCreated: () => void, closeDialog: () => void }) {
    const { toast } = useToast();
    const form = useForm<InboundFormValues>({
        resolver: zodResolver(inboundSchema),
    });

    async function onSubmit(values: InboundFormValues) {
        try {
            await addInboundTransfer(values.itemId, values.quantity, values.arrivalDate);
            toast({ title: "Inbound Transfer Logged", description: "The incoming stock has been registered." });
            onTransferCreated();
            form.reset();
            closeDialog();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not log inbound transfer." });
        }
    }
    
    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <DialogHeader>
                <DialogTitle>Log Inbound Stock Transfer</DialogTitle>
                <DialogDescription>Register new stock scheduled to arrive at the warehouse.</DialogDescription>
             </DialogHeader>
            <FormField control={form.control} name="itemId" render={({ field }) => (
                <FormItem><FormLabel>Product</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger></FormControl>
                        <SelectContent><ScrollArea className="h-48">{inventoryItems.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</ScrollArea></SelectContent>
                    </Select>
                <FormMessage /></FormItem>
            )} />
             <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="arrivalDate" render={({ field }) => (
                    <FormItem><FormLabel>Est. Arrival Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
             </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit">Log Transfer</Button>
            </DialogFooter>
          </form>
        </Form>
    );
}

export function WarehouseInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeDialog, setActiveDialog] = useState<"add" | "edit" | "inbound" | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInventory = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const fetchedInventory = await getInventory();
      setInventory(fetchedInventory);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch inventory." });
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(true);
  }, []);

  const handleAddItem = async (values: ItemFormValues) => {
    try {
      await addInventoryItem(values);
      toast({ title: "Success", description: "New item added to inventory." });
      fetchInventory();
    } catch (error) {
      console.error("Failed to add item:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add new item." });
    }
  };

  const handleUpdateItem = async (values: ItemFormValues) => {
    if (!selectedItem) return;
    try {
      await updateInventoryItem({ ...selectedItem, ...values, productDimensions: selectedItem.productDimensions });
      toast({ title: "Success", description: "Item details have been updated." });
      fetchInventory();
    } catch (error) {
      console.error("Failed to update item:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update item." });
    }
  };

  const handleDiscontinueItem = async (itemId: string) => {
    try {
        const item = inventory.find(i => i.id === itemId);
        if (!item) return;
        await updateInventoryItem({ ...item, status: 'Discontinued' });
        toast({ title: "Item Discontinued", description: `${item.name} has been marked as discontinued.`});
        fetchInventory();
    } catch(error) {
        toast({ variant: "destructive", title: "Error", description: "Could not discontinue item." });
    }
  };
  
  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedItem(null);
  };

  return (
    <>
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">
            Inventory Management
          </CardTitle>
          <CardDescription>
            A complete overview of your product catalog and stock levels.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveDialog('inbound')}><ArrowDownLeft /> Log Inbound</Button>
          <Button onClick={() => setActiveDialog('add')}><PlusCircle /> Add New Item</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)]">
            <Table>
            <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                         <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
                ) : (
                inventory.map((item) => (
                    <TableRow key={item.id} className={cn(item.status === 'Low Stock' && 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100/60')}>
                        <TableCell className="font-mono">{item.id}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-mono">{item.quantity.toLocaleString()}</TableCell>
                        <TableCell className="font-mono">GHS {item.unitCost.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[item.status])}>
                            {item.status}
                            </Badge>
                             {item.status === 'Inbound' && item.arrivalDate && (
                                <p className="text-xs text-muted-foreground mt-1">ETA: {new Date(item.arrivalDate).toLocaleDateString()}</p>
                            )}
                        </TableCell>
                        <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => { setSelectedItem(item); setActiveDialog('edit'); }}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                     <DropdownMenuItem className="text-destructive" onClick={() => handleDiscontinueItem(item.id)}>
                                        <XCircle className="mr-2 h-4 w-4" /> Discontinue
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>

    <Dialog open={!!activeDialog} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[625px]">
            {activeDialog === 'inbound' ? (
                <InboundTransferDialog inventoryItems={inventory} onTransferCreated={() => { fetchInventory(); closeDialog(); }} closeDialog={closeDialog} />
            ) : (
                <>
                    <DialogHeader>
                    <DialogTitle>{activeDialog === 'add' ? 'Add New' : 'Edit'} Inventory Item</DialogTitle>
                    <DialogDescription>
                        {activeDialog === 'add' ? "Fill in the details for the new stock item." : `Editing ${selectedItem?.name}.`}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <InventoryItemForm 
                            defaultValues={activeDialog === 'edit' ? selectedItem ?? undefined : undefined} 
                            onSubmit={activeDialog === 'add' ? handleAddItem : handleUpdateItem}
                            closeDialog={closeDialog}
                        />
                    </div>
                </>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}

    

    