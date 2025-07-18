
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
import { Phone } from "lucide-react";

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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.06 10.84c-.2.2-.48.3-1.09.05-.6-.25-1.28-.75-1.88-1.36-.6-.6-1.1-1.28-1.35-1.88-.25-.6.05-.9.25-1.1.2-.2.43-.25.6-.25h.3c.18 0 .36.05.5.25l.89.89c.15.15.2.35.05.55l-.3.48c-.15.2-.15.4.05.55l.68.68c.2.2.45.2.6.05l.48-.3c.2-.15.4-.1.55.05l.89.89c.2.2.25.38.25.55v.3c0 .2-.05.4-.25.6zM12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18.2a8.2 8.2 0 1 1 8.2-8.2 8.2 8.2 0 0 1-8.2 8.2zm4.5-6.04c-.38-.2-2.23-1.1-2.58-1.22-.35-.12-.6-.2-1 .2-.38.38-.98.98-1.2 1.2-.22.22-.43.25-.8.05-1.6-1-2.93-2.33-3.93-3.93-.2-.35-.05-.58.12-.78.15-.18.35-.38.5-.55.12-.15.2-.25.3-.4.1-.15.05-.3-.02-.42l-1.22-2.9c-.12-.3-.25-.38-.42-.38h-.42c-.2 0-.45.05-.65.25-.2.2-.78.78-.78 1.88 0 1.1.8 2.18 1.2 2.55.38.35 2.48 3.98 6.02 5.3 3.55 1.32 3.55.9 4.2.88.65-.02 2.02-.82 2.3-1.6.28-.78.28-1.45.2-1.58-.08-.13-.28-.2-.55-.38z"/>
    </svg>
)

function DirectSupportCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Need Immediate Help?</CardTitle>
                <CardDescription>Use the buttons below to contact our support team directly.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild size="lg" className="h-16 text-lg">
                    <a href="tel:+233240000000">
                        <Phone className="mr-4" /> Call Us Now
                    </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 text-lg border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                    <a href="https://wa.me/233240000000" target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="mr-4 h-6 w-6 fill-current" /> Chat on WhatsApp
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}

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
            <CardTitle className="text-xl">Submit a Complaint Online</CardTitle>
            <CardDescription>If your issue is not urgent, please provide details below.</CardDescription>
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
      <DirectSupportCard />
      <ComplaintForm orders={orders} onComplaintSubmitted={fetchData} />
      <ComplaintHistory complaints={complaints} isLoading={isLoading} />
    </div>
  );
}
