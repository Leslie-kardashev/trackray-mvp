
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BarChart3, Fuel } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { href: "/finance", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/finance/reports", label: "Reports", icon: BarChart3 },
    { href: "/finance/efficiency", label: "Tally Force", icon: Fuel },
  ];

  return (
    <>
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground flex items-center gap-2",
            (item.exact ? pathname === item.href : isActive(item.href)) ? "text-foreground font-semibold" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </>
  );
}
