import { mockInventory } from "@/lib/mock-data";
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
import { PlusCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { type InventoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: { [key in InventoryItem['status']]: string } = {
  'In Stock': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Inbound': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Outbound': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

export function AdminInventory() {
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
            <Button variant="outline"><ArrowUpRight/>Outbound</Button>
            <Button><PlusCircle/>Add Item</Button>
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
            {mockInventory.map((item) => (
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
