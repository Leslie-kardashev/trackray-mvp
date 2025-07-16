
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  const [role, setRole] = React.useState("driver");
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, you'd have authentication logic here.
    // For this demo, we'll just redirect based on the selected role.
    router.push(`/${role}`);
  };

  const roleConfig = {
    admin: { icon: ShieldCheck, label: "Admin" },
    driver: { icon: Truck, label: "Driver" },
    customer: { icon: ShoppingCart, label: "Customer" },
  };
  
  const SelectedIcon = roleConfig[role as keyof typeof roleConfig].icon;

  return (
    <Card className="shadow-none border-0 bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
        <CardDescription>
          Select your role to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role" className="w-full py-6 text-base">
              <SelectValue asChild>
                <span className="flex items-center gap-2">
                  <SelectedIcon className="h-5 w-5 text-muted-foreground" />
                  {roleConfig[role as keyof typeof roleConfig].label}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleConfig).map(([key, { icon: Icon, label }]) => (
                <SelectItem key={key} value={key} className="py-3 text-base">
                  <span className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} className="w-full font-bold text-lg py-6">
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}
