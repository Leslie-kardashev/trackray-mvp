"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <>
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground",
            isActive(item.href) ? "text-foreground font-semibold" : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
