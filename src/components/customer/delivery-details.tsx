
'use client';

import { Dispatch, SetStateAction } from 'react';
import { User, Location } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { LocationPicker } from '../location-picker';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface DeliveryDetailsProps {
  user: User | null;
  deliveryLocation: Location | null;
  setDeliveryLocation: Dispatch<SetStateAction<Location | null>>;
  deliveryDate: Date | undefined;
  setDeliveryDate: Dispatch<SetStateAction<Date | undefined>>;
  paymentPreference: 'Prepaid' | 'Pay On Credit';
  setPaymentPreference: Dispatch<SetStateAction<'Prepaid' | 'Pay On Credit'>>;
}

export function DeliveryDetails({
  user,
  deliveryLocation,
  setDeliveryLocation,
  deliveryDate,
  setDeliveryDate,
  paymentPreference,
  setPaymentPreference,
}: DeliveryDetailsProps) {
  
  return (
    <div className="space-y-6">
      <div>
        <Label>Drop-off Point</Label>
        <div className="mt-2 text-sm p-3 border rounded-md flex justify-between items-center">
            <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                    {deliveryLocation ? deliveryLocation.address : 'Select a location'}
                </span>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Change</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Select Delivery Location</DialogTitle>
                    </DialogHeader>
                     <LocationPicker onLocationConfirm={setDeliveryLocation} />
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <div>
        <Label>Schedule Delivery</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal mt-2',
                !deliveryDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deliveryDate ? format(deliveryDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deliveryDate}
              onSelect={setDeliveryDate}
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Payment Preference</Label>
        <RadioGroup
          value={paymentPreference}
          onValueChange={(value) => setPaymentPreference(value as 'Prepaid' | 'Pay On Credit')}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Prepaid" id="prepaid" />
            <Label htmlFor="prepaid" className="font-normal">Prepaid</Label>
          </div>
          {user?.type === 'Business' && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pay On Credit" id="credit" />
              <Label htmlFor="credit" className="font-normal">Pay On Credit</Label>
            </div>
          )}
        </RadioGroup>
      </div>
    </div>
  );
}
