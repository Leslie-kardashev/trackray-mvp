
"use client";

import { useState, useEffect } from "react";
import { getComplaints } from "@/lib/data-service";
import { type Complaint } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { MessageSquareWarning, ArrowRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const statusStyles: { [key in Complaint['status']]: string } = {
    'Open': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

export function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const fetchedComplaints = await getComplaints();
      setComplaints(fetchedComplaints);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(true);
    const interval = setInterval(() => fetchComplaints(false), 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <MessageSquareWarning /> Customer Complaint Log
        </CardTitle>
        <CardDescription>
          Review and manage all customer-submitted complaints and issues.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Complaint ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono">{complaint.id}</TableCell>
                    <TableCell className="font-medium">{complaint.customerName}</TableCell>
                    <TableCell className="font-mono">{complaint.orderId}</TableCell>
                    <TableCell>{complaint.complaintType}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{complaint.description}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(complaint.timestamp), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border-0 font-semibold", statusStyles[complaint.status])}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">View Details <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No complaints have been submitted.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
