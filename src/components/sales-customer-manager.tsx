
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

export function SalesCustomerManager() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Customers</CardTitle>
                <CardDescription>
                Onboard new customers and view existing profiles.
                </CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2" />
                Add New Customer
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-16">
          Customer list and onboarding form will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}
