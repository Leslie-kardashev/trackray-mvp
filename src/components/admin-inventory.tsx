
"use client";

import { useState } from "react";
import { mockInventory } from "@/lib/mock-data";
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

const statusStyles: { [key in InventoryItem['status']]: string } = {
  'In Stock': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Inbound': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Outbound': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
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

export function AdminInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated'>) => {
    const newId = `ITM-${String(inventory.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    setInventory(prev => [...prev, {
      ...newItem,
      id: newId,
      status: 'In Stock',
      lastUpdated: today
    }]);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">
            Inventory Management
          </CardTitle>
          <CardDescription>
            Track and manage your current stock.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><ArrowDownLeft />Inbound</Button>
          <Button variant="outline"><ArrowUpRight />Outbound</Button>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", statusStyles[item.status])}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
