
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
import { Gauge } from "lucide-react";

export function FinanceVehicleEfficiency() {
    const vehicles = [
        { id: 'TRK-01', idleTime: '45 mins', stops: 12, avgSpeed: '45 km/h' },
        { id: 'TRK-02', idleTime: '1.2 hours', stops: 8, avgSpeed: '38 km/h' },
        { id: 'TRK-03', idleTime: '25 mins', stops: 25, avgSpeed: '55 km/h' },
    ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Gauge /> Vehicle Usage & Efficiency
        </CardTitle>
        <CardDescription>
          Daily statistics on vehicle operational efficiency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle ID</TableHead>
              <TableHead>Daily Idle Time</TableHead>
              <TableHead># of Stops</TableHead>
              <TableHead>Avg. Speed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-mono">{vehicle.id}</TableCell>
                <TableCell>{vehicle.idleTime}</TableCell>
                <TableCell>{vehicle.stops}</TableCell>
                <TableCell>{vehicle.avgSpeed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
