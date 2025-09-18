
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";


export function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, you'd have authentication logic here that talks to your Django backend.
    // For this demo, we'll just redirect to the driver dashboard.
    router.push(`/driver`);
  };


  return (
    <Card className="w-full shadow-none border-none bg-transparent">
        <CardContent className="p-0">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="driverId">Driver ID</Label>
                    <Input id="driverId" placeholder="Enter your Driver ID" defaultValue="DRV-001" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" defaultValue="password" />
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-0 pt-6">
            <Button onClick={handleLogin} className="w-full font-bold text-lg py-6">
                <Truck className="mr-2"/>
                Sign In
            </Button>
      </CardFooter>
    </Card>
  );
}
