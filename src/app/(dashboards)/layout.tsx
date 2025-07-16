import { UserMenu } from "@/components/user-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";

const AppLogo = () => (
    <svg role="img" aria-label="TrackRay Logo" className="w-auto h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-foreground"
          >
            <AppLogo />
            <span className="font-headline text-xl font-bold tracking-tighter">TrackRay</span>
          </Link>
          <DashboardNav />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <AppLogo />
                <span className="font-headline text-xl font-bold tracking-tighter">TrackRay</span>
              </Link>
              <DashboardNav />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
                {/* Optional search bar can go here */}
            </div>
          <UserMenu />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
