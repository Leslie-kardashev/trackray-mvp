
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { AlertTriangle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendSOS } from '@/lib/data-service';
import { cn } from '@/lib/utils';
import { type SOSMessage } from '@/lib/types';

type ProblemCode = SOSMessage['problemCode'];

const tcasCategories = {
  critical: {
    label: 'Critical Emergency',
    color: 'bg-red-500 hover:bg-red-600',
    icon: '🔴',
    codes: [
      { code: 'BT', description: 'Burst/Flat Tire' },
      { code: 'MF', description: 'Mechanical Fault' },
      { code: 'FS', description: 'Fuel Shortage' },
      { code: 'SOS', description: 'Robbery/Attack/Medical' },
    ],
  },
  blockage: {
    label: 'Movement Blockage',
    color: 'bg-orange-500 hover:bg-orange-600',
    icon: '🟠',
    codes: [
      { code: 'TR', description: 'Heavy Traffic' },
      { code: 'NP', description: 'No Parking' },
      { code: 'AC', description: 'Accident on Route' },
    ],
  },
  external: {
    label: 'External Delays',
    color: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    icon: '🟡',
    codes: [
      { code: 'PD', description: 'Police/Customs Delay' },
      { code: 'BW', description: 'Bad Weather/Road' },
    ],
  },
  customer: {
    label: 'Customer Issue',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: '🔵',
    codes: [
      { code: 'CU', description: 'Customer Unavailable' },
      { code: 'SC', description: 'Site Closed' },
    ],
  },
};

export function DriverSOS() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendSOS = async (problemCode: ProblemCode, message: string) => {
    setIsSending(true);
    try {
      const driverId = 'DRV-001'; // Placeholder
      const driverName = 'Kofi Anan'; // Placeholder

      await sendSOS({
        driverId,
        driverName,
        message,
        problemCode,
        location: 'Last known location: N1 Highway, near Tema', // Placeholder
      });

      toast({
        title: 'Alert Sent!',
        description: `HQ has been notified of the issue: ${message}.`,
      });
      setSheetOpen(false);
    } catch (error) {
      console.error('Failed to send SOS:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not send alert. Please try again or call support.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" /> Report an Issue
        </CardTitle>
        <CardDescription className="text-xs">
          Use the TrackRay Color Alert System (TCAS) for emergencies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="destructive" className="w-full h-16 text-lg font-bold">
              <AlertTriangle className="w-6 h-6 mr-3" />
              REPORT ISSUE
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-full rounded-t-lg max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>TrackRay Color Alert System (TCAS)</SheetTitle>
              <SheetDescription>
                Select the category and specific problem you are facing. This will immediately notify dispatch.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              {Object.values(tcasCategories).map(category => (
                <div key={category.label}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    {category.icon} {category.label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {category.codes.map(item => (
                      <Button
                        key={item.code}
                        variant="default"
                        className={cn('h-20 text-sm font-semibold flex-col text-center', category.color)}
                        onClick={() => handleSendSOS(item.code as ProblemCode, item.description)}
                        disabled={isSending}
                      >
                         <span className="text-xl font-bold">{item.code}</span>
                        <span className="text-xs font-light text-center leading-tight">{item.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter>
                <Button variant="outline" className="w-full" onClick={() => setSheetOpen(false)} disabled={isSending}>
                    Cancel
                </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}
