
"use client";

import { useState, useEffect } from "react";
import { getInventory, addInventoryItem } from "@/lib/data-service";
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
import { PlusCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";

const statusStyles: { [key in InventoryItem['status']]: string } = {
  'In Stock': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Low Stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Inbound': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Outbound': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
};

const newItemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters."),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative."),
});

type NewItemFormValues = z.infer<typeof newItemSchema>;

function AddItemForm({ onAddItem, closeDialog }: { onAddItem: (item: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated'>) => void; closeDialog: () => void }) {
  const form = useForm<NewItemFormValues>({
    resolver: zodResolver(newItemSchema),
    defaultValues: {
      name: "",
      quantity: 0,
    },
  });

  function onSubmit(values: NewItemFormValues) {
    onAddItem({ name: values.name, quantity: values.quantity });
    form.reset();
    closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Kente Cloth Rolls" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add Item</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function WarehouseInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const fetchedInventory = await getInventory();
      setInventory(fetchedInventory);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch inventory." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (newItem: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated'>) => {
    try {
      await addInventoryItem(newItem);
      toast({ title: "Success", description: "New item added to inventory." });
      fetchInventory(); // Refresh the list
    } catch (error) {
      console.error("Failed to add item:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add new item." });
    }
  };
  
    const handleTransfer = (type: 'Inbound' | 'Outbound') => {
        toast({
            title: `${type} Transfer`,
            description: `This would open a modal to create a new ${type.toLowerCase()} stock transfer.`
        })
    }

  return (
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
          <Button variant="outline" onClick={() => handleTransfer('Inbound')}><ArrowDownLeft />Inbound</Button>
          <Button variant="outline" onClick={() => handleTransfer('Outbound')}><ArrowUpRight />Outbound</Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle />Add Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new stock item.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <AddItemForm onAddItem={handleAddItem} closeDialog={() => setAddDialogOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
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
                        </TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
