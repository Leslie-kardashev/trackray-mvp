
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getOrders, getComplaints, addComplaint } from "@/lib/data-service";
import { type Order, type Complaint } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

const complaintSchema = z.object({
  orderId: z.string({ required_error: "Please select the relevant order." }),
  complaintType: z.enum(['Lateness', 'Damaged Item', 'Driver Conduct', 'Billing Issue', 'Other'], {
    required_error: "Please select a complaint type.",
  }),
  description: z.string().min(10, "Please provide a detailed description (at least 10 characters)."),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

const statusStyles: { [key in Complaint['status']]: string } = {
    'Open': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

function ComplaintForm({ orders, onComplaintSubmitted }: { orders: Order[], onComplaintSubmitted: () => void }) {
  const { toast } = useToast();
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
        description: "",
    },
  });

  async function onSubmit(values: ComplaintFormValues) {
    try {
      await addComplaint({
        customerId: "CUS-101", // Placeholder for logged-in customer
        customerName: "Customer 101",
        orderId: values.orderId,
        complaintType: values.complaintType,
        description: values.description,
      });
      toast({ title: "Complaint Submitted", description: "Our support team will review your issue shortly." });
      form.reset();
      onComplaintSubmitted();
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your complaint." });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-xl">Submit a New Complaint</CardTitle>
            <CardDescription>We're sorry you had an issue. Please provide details below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Related Order</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an order" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {orders.map(order => (
                                    <SelectItem key={order.id} value={order.id}>
                                        {order.id} - {order.item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="complaintType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type of Issue</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an issue type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Lateness">Lateness</SelectItem>
                                <SelectItem value="Damaged Item">Damaged Item</SelectItem>
                                <SelectItem value="Driver Conduct">Driver Conduct</SelectItem>
                                <SelectItem value="Billing Issue">Billing Issue</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Please describe the issue in detail..." {...field} rows={5}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Complaint</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function ComplaintHistory({ complaints, isLoading }: { complaints: Complaint[], isLoading: boolean }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">My Complaint History</CardTitle>
                <CardDescription>A log of your past and current support tickets.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Complaint ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                             Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : complaints.length > 0 ? (
                            complaints.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-mono">{c.id}</TableCell>
                                    <TableCell className="font-mono">{c.orderId}</TableCell>
                                    <TableCell>{format(new Date(c.timestamp), "PPP")}</TableCell>
                                    <TableCell>{c.complaintType}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[c.status])}>{c.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">You have not submitted any complaints.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    );
}


export function CustomerComplaints() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        // "CUS-101" is the placeholder for the logged-in customer
      const [customerOrders, customerComplaints] = await Promise.all([
        getOrders().then(allOrders => allOrders.filter(o => o.customerId === "CUS-101")),
        getComplaints("CUS-101")
      ]);
      setOrders(customerOrders);
      setComplaints(customerComplaints);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <ComplaintForm orders={orders} onComplaintSubmitted={fetchData} />
      <ComplaintHistory complaints={complaints} isLoading={isLoading} />
    </div>
  );
}
