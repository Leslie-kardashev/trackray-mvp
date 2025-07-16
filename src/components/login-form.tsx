
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, ShoppingCart, Landmark } from "lucide-react";

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
    finance: { icon: Landmark, label: "Finance" },
  };
  
  const SelectedIcon = roleConfig[role as keyof typeof roleConfig].icon;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Sign In</h1>
            <p className="text-muted-foreground">Select your role to continue</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="w-full py-6 text-base">
                 <SelectValue asChild>
                   <span className="flex items-center gap-2">
                      <SelectedIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{roleConfig[role as keyof typeof roleConfig].label}</span>
                    </span>
                 </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleConfig).map(([key, { icon: Icon, label }]) => (
                  <SelectItem key={key} value={key} className="py-3 text-base">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
