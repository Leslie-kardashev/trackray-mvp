
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

export function SalesOrderManager() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Orders</CardTitle>
                <CardDescription>
                    Create new orders for customers and track their status.
                </CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2" />
                Create New Order
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-16">
          Order creation form and tracking list will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}
