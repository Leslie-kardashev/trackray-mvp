
"use client";

import { useState, useEffect } from "react";
import { getSOSMessages, getDriverById } from "@/lib/data-service";
import { type SOSMessage, type Driver } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Phone, User, Clock, MessageSquare, MapPin } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function AdminSosAlerts() {
  const [messages, setMessages] = useState<SOSMessage[]>([]);
  const [drivers, setDrivers] = useState<Map<string, Driver>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const fetchedMessages = await getSOSMessages();
      setMessages(fetchedMessages);

      // Fetch driver details for any new drivers
      const newDriverIds = fetchedMessages
        .map(m => m.driverId)
        .filter(id => !drivers.has(id));
      
      if (newDriverIds.length > 0) {
        const newDrivers = await Promise.all(
            newDriverIds.map(id => getDriverById(id).then(d => [id, d] as const))
        );
        setDrivers(prev => new Map([...prev, ...newDrivers.filter(([,d]) => d)]));
      }

    } catch (error) {
      console.error("Failed to fetch SOS alerts:", error);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(true);
    const interval = setInterval(() => fetchAlerts(false), 3000); // Poll every 3 seconds for urgency
    return () => clearInterval(interval);
  }, []);

  const getDriver = (driverId: string) => drivers.get(driverId);

  return (
    <Card className="shadow-sm h-full sticky top-24 border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-6 h-6 animate-pulse" /> SOS Alerts
        </CardTitle>
        <CardDescription className="text-destructive/80">
          Urgent assistance requests from drivers. Respond immediately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-4">
            {isLoading ? (
                Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : messages.length > 0 ? (
                messages.map((msg) => {
                    const driver = getDriver(msg.driverId);
                    return (
                      <div key={msg.id} className="p-4 rounded-lg border bg-background shadow-sm">
                        <div className="flex justify-between items-start">
                           <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" /> {msg.driverName}
                                </h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                </p>
                           </div>
                           {driver && (
                            <Button size="sm" asChild>
                                <a href={`tel:${driver.phone}`}>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Driver
                                </a>
                            </Button>
                           )}
                        </div>

                        <Separator className="my-2" />
                        
                        <div className="space-y-2 text-sm">
                            {msg.message && <p className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span className="italic">"{msg.message}"</span>
                            </p>}

                             <p className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>Location: {msg.location || 'Unavailable'}</span>
                            </p>
                        </div>

                      </div>
                    )
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                    <AlertTriangle className="w-10 h-10 mb-2" />
                    <p>No active SOS alerts.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
