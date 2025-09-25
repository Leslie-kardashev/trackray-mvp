
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = React.useState("warehouse");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: `Redirecting to the ${role} dashboard...`,
    });
    // For this demo, we'll just redirect based on the selected role.
    router.push(`/${role}`);
  };

  return (
    <form onSubmit={handleLogin}>
      <Card className="w-full shadow-none border-none bg-transparent">
          <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentId">Agent Role</Label>
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Superadmin</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentId">Agent ID</Label>
                <Input id="agentId" placeholder="Enter your Agent ID" required defaultValue={`AGENT-${role.toUpperCase()}-01`} />
              </div>
              <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="passcode">Passcode</Label>
                    <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                        Forgot Passcode?
                    </Link>
                  </div>
                <Input id="passcode" type="password" required defaultValue="password123" />
              </div>
          </CardContent>
          <CardFooter className="p-0 pt-6 flex-col items-stretch gap-4">
              <Button type="submit" className="w-full font-bold text-lg py-6">
                Sign In
              </Button>
              <p className="text-center text-xs text-muted-foreground">For demo purposes, select a role and click Sign In.</p>
      </CardFooter>
    </Card>
    </form>
  );
}
