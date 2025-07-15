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
    <svg
      role="img"
      aria-label="TrackRay Logo"
      className="w-8 h-8"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM32.3999 35.7C34.4999 37.8 35.7999 40.6 35.7999 43.7C35.7999 46.8 34.4999 49.6 32.3999 51.7L32.4999 51.8C33.4999 51.5 34.5999 51.3 35.6999 51.3C40.9999 51.3 45.3999 53.4 48.3999 56.9L48.2999 56.8C46.1999 54.7 44.8999 51.9 44.8999 48.8C44.8999 45.7 46.1999 42.9 48.2999 40.8L48.3999 40.7C45.3999 37.2 40.9999 35.1 35.6999 35.1C34.5999 35.1 33.4999 35.3 32.4999 35.6L32.3999 35.7ZM64.3001 22.4C64.6001 23.4 64.8001 24.5 64.8001 25.6C64.8001 30.9 62.7001 35.3 59.2001 38.3L59.3001 38.2C61.4001 36.1 64.2001 34.8 67.3001 34.8C70.4001 34.8 73.2001 36.1 75.3001 38.2L75.4001 38.3C71.9001 41.3 67.5001 43.4 62.2001 43.4C61.1001 43.4 60.0001 43.2 58.9001 42.9L59.0001 43C59.0001 39.5 57.8001 36.3 55.8001 34L55.9001 34.1C58.8001 30.2 61.3001 25.7 62.4001 20.7L62.2001 20.8C62.7001 21.3 63.2001 21.8 63.6001 22.4H64.3001V22.4ZM67.6001 64.3C65.5001 62.2 64.2001 59.4 64.2001 56.3C64.2001 53.2 65.5001 50.4 67.6001 48.3L67.5001 48.2C66.5001 48.5 65.4001 48.7 64.3001 48.7C59.0001 48.7 54.6001 46.6 51.6001 43.1L51.7001 43.2C53.8001 45.3 55.1001 48.1 55.1001 51.2C55.1001 54.3 53.8001 57.1 51.7001 59.2L51.6001 59.3C54.6001 62.8 59.0001 64.9 64.3001 64.9C65.4001 64.9 66.5001 64.7 67.5001 64.4L67.6001 64.3ZM35.8001 77.6C35.5001 76.6 35.3001 75.5 35.3001 74.4C35.3001 69.1 37.4001 64.7 40.9001 61.7L40.8001 61.8C38.7001 63.9 35.9001 65.2 32.8001 65.2C29.7001 65.2 26.9001 63.9 24.8001 61.8L24.7001 61.7C28.2001 58.7 32.6001 56.6 37.9001 56.6C39.0001 56.6 40.1001 56.8 41.2001 57.1L41.1001 57C41.1001 60.5 42.3001 63.7 44.3001 66L44.2001 65.9C41.3001 69.8 38.8001 74.3 37.7001 79.3L37.9001 79.2C37.4001 78.7 36.9001 78.2 36.5001 77.6H35.8001V77.6Z" fill="currentColor"/>
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
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
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