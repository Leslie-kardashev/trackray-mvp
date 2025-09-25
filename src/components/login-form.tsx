
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Warehouse } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    // For this demo, we'll just redirect to the warehouse dashboard.
    router.push(`/warehouse`);
  };

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
        <CardContent className="p-0">
            <div className="space-y-4">
                <p className="text-muted-foreground">This portal is for authorized warehouse personnel only.</p>
            </div>
        </CardContent>
        <CardFooter className="p-0 pt-4">
            <Button onClick={handleLogin} className="w-full font-bold text-lg py-6">
            Sign In to Warehouse Portal
            </Button>
      </CardFooter>
    </Card>
  );
}
