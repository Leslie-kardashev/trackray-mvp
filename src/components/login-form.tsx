
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, ShoppingCart, Landmark, Briefcase } from "lucide-react";

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
    sales: { icon: Briefcase, label: "Sales" },
  };
  
  const SelectedIcon = roleConfig[role as keyof typeof roleConfig].icon;

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
        <CardContent className="p-0">
            <div className="space-y-4">
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
        <CardFooter className="p-0 pt-4">
            <Button onClick={handleLogin} className="w-full font-bold text-lg py-6">
            Sign In
            </Button>
      </CardFooter>
    </Card>
  );
}
