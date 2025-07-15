import { DashboardNav } from "@/components/dashboard-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <Link
              href="/"
              className="block outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            >
              <Card className="bg-primary text-primary-foreground border-0 shadow-lg group-data-[collapsible=icon]:p-2 transition-all duration-300">
                <CardContent className="p-2 flex items-center gap-2">
                  <svg
                    role="img"
                    aria-label="TrackRay Logo"
                    className="w-8 h-8 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6 transition-all duration-300"
                    viewBox="0 0 62 62"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31 0C48.12 0 62 13.88 62 31C62 48.12 48.12 62 31 62C13.88 62 0 48.12 0 31C0 13.88 13.88 0 31 0ZM26.0625 15.5L15.5 26.0625L35.9375 46.5L46.5 35.9375L26.0625 15.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="font-headline text-2xl font-bold tracking-tighter group-data-[collapsible=icon]:hidden">
                    TrackRay
                  </span>
                </CardContent>
              </Card>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50 group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="profile picture" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Demo User</span>
              </div>
              <Button asChild variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden">
                <Link href="/">
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Log Out</span>
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
            <header className="p-4 flex items-center gap-4 md:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <SidebarTrigger />
                <h2 className="font-headline text-xl font-bold">TrackRay</h2>
            </header>
            <SidebarInset className="p-4 md:p-6 lg:p-8">
                {children}
            </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
