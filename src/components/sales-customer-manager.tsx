
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCustomers, addCustomer } from "@/lib/data-service";
import { type Customer, type Location } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  address: z.string().min(3, "Address is required."),
  customerType: z.enum(["Retailer", "Wholesaler", "Other"]),
  paymentPreference: z.enum(["Cash", "Credit"]),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

function AddCustomerForm({ onCustomerAdded, closeDialog }: { onCustomerAdded: () => void; closeDialog: () => void }) {
  const { toast } = useToast();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "", email: "", address: "" },
  });

  async function onSubmit(values: CustomerFormValues) {
    try {
      const location: Location = {
        address: values.address,
        // In a real app, this would be geocoded from the address
        coords: { lat: 5.6037, lng: -0.1870 } 
      };
      await addCustomer({ ...values, location });
      toast({ title: "Success", description: "New customer has been onboarded." });
      onCustomerAdded();
      form.reset();
      closeDialog();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add customer." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input placeholder="+233 24 123 4567" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
                <FormLabel>Email Address (Optional)</FormLabel>
                <FormControl><Input placeholder="user@domain.com" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )} />
        </div>
        <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem>
            <FormLabel>Drop-off Location</FormLabel>
            <FormControl><Input placeholder="123 Main St, Accra" {...field} /></FormControl>
            <FormMessage />
            </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="customerType" render={({ field }) => (
                <FormItem>
                    <FormLabel>Customer Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Retailer">Retailer</SelectItem>
                            <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="paymentPreference" render={({ field }) => (
                <FormItem>
                    <FormLabel>Payment Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Cash">Cash on Delivery</SelectItem>
                            <SelectItem value="Credit">Credit/Invoice</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
          <Button type="submit">Add Customer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function SalesCustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Customers</CardTitle>
                <CardDescription>Onboard new customers and view existing profiles.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2" />Add New Customer</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Onboard New Customer</DialogTitle>
                  <DialogDescription>Fill in the details to register a new customer.</DialogDescription>
                </DialogHeader>
                <AddCustomerForm onCustomerAdded={fetchCustomers} closeDialog={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
            <Table>
                <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell className="font-mono">{customer.id}</TableCell>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.location.address}</TableCell>
                                <TableCell>{customer.customerType}</TableCell>
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
