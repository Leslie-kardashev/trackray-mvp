"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function DashboardNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const role = pathname.split("/")[1];

  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [{ href: "/admin", label: "Admin Hub", icon: ShieldCheck }];
      case "driver":
        return [{ href: "/driver", label: "Driver Tools", icon: Truck }];
      case "customer":
        return [{ href: "/customer", label: "Order Center", icon: ShoppingCart }];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <SidebarMenu>
      {navItems.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.href)}
            tooltip={{ children: item.label }}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
