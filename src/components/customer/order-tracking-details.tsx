
'use client';

import { Order, TrackingStatus } from '@/lib/types';
import { Progress } from '../ui/progress';
import { Truck, Package, TrafficCone, ParkingCircle, Siren, CheckCircle, MapPin } from 'lucide-react';
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

  return (
    <div className="w-full space-y-4 p-4">
      <Progress value={order.trackingProgress} />
      <div className="flex justify-between items-center text-sm">
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
  );
}
