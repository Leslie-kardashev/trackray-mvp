
'use client';

import { Order, TrackingStatus } from '@/lib/types';
import { Truck, Package, TrafficCone, ParkingCircle, Siren, CheckCircle, MapPin, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTrackingDetailsProps {
  order: Order;
}

const statusIcons: Record<TrackingStatus, React.ElementType> = {
    'Driver Assigned': Package,
    'Moving': Truck,
    'Parked': ParkingCircle,
    'In Traffic': TrafficCone,
    'SOS': Siren,
    'Inbound': MapPin,
    'Arriving': MapPin,
    'Arrived': CheckCircle,
}

const statusColors: Record<TrackingStatus, string> = {
    'Driver Assigned': 'text-sky-600',
    'Moving': 'text-blue-600',
    'Parked': 'text-amber-600',
    'In Traffic': 'text-orange-600',
    'SOS': 'text-red-600',
    'Inbound': 'text-indigo-600',
    'Arriving': 'text-purple-600',
    'Arrived': 'text-green-600',
}

export function OrderTrackingDetails({ order }: OrderTrackingDetailsProps) {
  if (!order.trackingStatus || order.trackingProgress === undefined) {
    return null;
  }
  
  const Icon = statusIcons[order.trackingStatus];
  const colorClass = statusColors[order.trackingStatus];
  const progress = Math.min(Math.max(order.trackingProgress, 0), 100);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="space-y-2">
        <div className="relative h-6 w-full">
            {/* Track */}
            <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full bg-secondary overflow-hidden">
                 {/* Progress Fill */}
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
           
            {/* Start Icon */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                 <Package className="h-4 w-4 text-primary-foreground" />
            </div>

            {/* Truck Icon */}
            <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500" 
                style={{ left: `calc(${progress}% - ${progress / 100 * 24}px)` }}
            >
               <Truck 
                className={cn(
                    "h-6 w-6 text-primary transition-transform duration-500",
                    progress < 100 && "scale-x-[-1]" 
                )} 
               />
            </div>
             {/* End Icon */}
             <div className="absolute top-1/2 -translate-y-1/2 right-0 h-6 w-6 rounded-full bg-card border flex items-center justify-center">
                 <Home className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>

        <div className="flex justify-between items-center text-sm pt-2">
            <div className={cn("flex items-center gap-2 font-semibold", colorClass)}>
                <Icon className="h-5 w-5"/>
                <span>{order.trackingStatus}</span>
            </div>
            {order.currentLocationArea && (
                <span className="text-muted-foreground font-medium">
                    {order.currentLocationArea}
                </span>
            )}
        </div>
      </div>
    </div>
  );
}
