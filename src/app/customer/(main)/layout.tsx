
'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  ShoppingCart,
  Package,
  User as UserIcon,
  Headset,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AppLogo = () => (
    <svg role="img" aria-label="Thonket Logo" className="w-auto h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const navItems = [
  { href: '/customer/dashboard', label: 'Browse & Order', icon: Home },
  { href: '/customer/cart', label: 'My Cart', icon: ShoppingCart, badgeKey: 'cart' },
  { href: '/customer/orders', label: 'My Orders', icon: Package, badgeKey: 'orders' },
  { href: '/customer/profile', label: 'My Profile', icon: UserIcon },
  { href: '/customer/support', label: 'Customer Service', icon: Headset },
];

function MainNavContent() {
  const pathname = usePathname();
  const { user, cart, orders, logout } = useContext(AppContext);

  const getBadgeCount = (key?: string) => {
    if (key === 'cart') return cart.length;
    if (key === 'orders') return orders.filter(o => o.status === 'Out for Delivery').length;
    return 0;
  }

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <AppLogo />
            <div className="flex items-center gap-2">
                <h1 className="font-headline text-2xl font-bold tracking-tighter">
                    Thonket
                </h1>
                <Badge variant="outline">Shop</Badge>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const badgeCount = getBadgeCount(item.badgeKey);
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="relative"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {badgeCount > 0 && (
                       <Badge variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2">{badgeCount}</Badge>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
         <Link href="/customer/login">
            <Button variant="ghost" className="justify-start gap-2 w-full" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
         </Link>
      </SidebarFooter>
    </>
  );
}


function MobileBottomNav() {
    const pathname = usePathname();
    const { cart, orders } = useContext(AppContext);

    const getBadgeCount = (key?: string) => {
        if (key === 'cart') return cart.length;
        if (key === 'orders') return orders.filter(o => o.status === 'Out for Delivery').length;
        return 0;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 md:hidden z-50">
            <div className="grid h-full grid-cols-5">
                {navItems.map((item) => {
                    const badgeCount = getBadgeCount(item.badgeKey);
                    return (
                        <Link key={item.href} href={item.href} className={cn(
                            "flex flex-col items-center justify-center gap-1 text-xs",
                            pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )}>
                            <div className="relative">
                                <item.icon className="h-6 w-6" />
                                {badgeCount > 0 && (
                                    <Badge variant="destructive" className="absolute -top-1 -right-2 h-4 w-4 justify-center p-0">{badgeCount}</Badge>
                                )}
                            </div>
                            <span className="truncate">{item.label === 'Browse & Order' ? 'Shop' : item.label === 'Customer Service' ? 'Support' : item.label }</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <Sidebar>
        <MainNavContent />
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <AppLogo />
                <div className="flex items-center gap-2">
                    <h1 className="font-headline text-2xl font-bold tracking-tighter">
                        Thonket
                    </h1>
                    <Badge variant="outline">Shop</Badge>
                </div>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            {children}
        </main>
      </SidebarInset>
      {isMobile && <MobileBottomNav />}
    </SidebarProvider>
  );
}
