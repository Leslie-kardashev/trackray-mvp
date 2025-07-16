
"use client";

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
import { Badge } from "./ui/badge";
import { Wrench } from "lucide-react";

export function FinanceMaintenance() {
    const vehicles = [
        { id: 'TRK-01', nextService: '5,000 km', repairCost: 'GHS 250', maintenanceCost: 'GHS 800', costPerKm: 'GHS 1.50', status: 'Okay' },
        { id: 'TRK-02', nextService: '1,200 km', repairCost: 'GHS 0', maintenanceCost: 'GHS 600', costPerKm: 'GHS 1.25', status: 'Service Due' },
        { id: 'TRK-03', nextService: '8,000 km', repairCost: 'GHS 1,500', maintenanceCost: 'GHS 2,000', costPerKm: 'GHS 2.10', status: 'High Cost' },
    ];

    const statusStyles: { [key: string]: string } = {
        'Okay': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Service Due': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'High Cost': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Wrench /> Truck Maintenance Financials
        </CardTitle>
        <CardDescription>
          Monitor maintenance costs and service schedules for each vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle ID</TableHead>
              <TableHead>Next Service</TableHead>
              <TableHead>Monthly Repair Cost</TableHead>
              <TableHead>Cost / KM</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-mono">{vehicle.id}</TableCell>
                <TableCell>{vehicle.nextService}</TableCell>
                <TableCell>{vehicle.repairCost}</TableCell>
                <TableCell>{vehicle.costPerKm}</TableCell>
                <TableCell>
                    <Badge variant="outline" className={statusStyles[vehicle.status]}>
                        {vehicle.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
