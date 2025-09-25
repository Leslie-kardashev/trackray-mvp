
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Boxes, BarChart3 } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/warehouse", label: "Dashboard", icon: LayoutDashboard },
    { href: "/warehouse/orders", label: "Orders", icon: Package },
    { href: "/warehouse/inventory", label: "Inventory", icon: Boxes },
    { href: "/warehouse/reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <>
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground flex items-center gap-2",
            isActive(item.href) ? "text-foreground font-semibold" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </>
  );
}
