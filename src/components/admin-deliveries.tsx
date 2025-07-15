import { mockOrders } from "@/lib/mock-data";
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
import { type Order } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: { [key in Order['status']]: string } = {
  'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function AdminDeliveries() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Live Deliveries
        </CardTitle>
        <CardDescription>
          Real-time monitoring of all active orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">{order.id}</TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell>{order.destination}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", statusStyles[order.status])}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.orderDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
