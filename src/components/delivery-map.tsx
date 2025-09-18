
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { MapIcon, Milestone, Timer } from 'lucide-react';
import { type Location } from '@/lib/types';

const DRIVER_ICON = {
  path: 'M2,10.1c0,0,0-0.1,0-0.1s0-0.1,0-0.1c0-2.8,2.2-5,5-5s5,2.2,5,5c0,0,0,0.1,0,0.1s0,0.1,0,0.1H2z M7,12.1 c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S8.7,12.1,7,12.1z M7,7.1C6.4,7.1,6,6.6,6,6.1s0.4-1,1-1s1,0.4,1,1S7.6,7.1,7,7.1z M12.5,10.1H14c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1.5V10.1z M0,10.1h1.5V8.1H0V10.1z',
  fillColor: 'hsl(var(--primary))',
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: 'hsl(var(--primary-foreground))',
  rotation: 0,
  scale: 1.8,
  anchor: { x: 7, y: 10 },
};

function Directions({
  origin,
  destination,
  setEta,
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  setEta: (eta: { distance: string; duration: string } | null) => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then(response => {
        directionsRenderer.setDirections(response);

        const route = response.routes[0];
        if (route && route.legs[0]) {
          const leg = route.legs[0];
          setEta({
            distance: leg.distance?.text ?? 'N/A',
            duration: leg.duration?.text ?? 'N/A',
          });
        }
      });
  }, [directionsService, directionsRenderer, origin, destination, setEta]);

  return null;
}

export function DeliveryMap({ origin, destination }: { origin: Location['coords']; destination: Location['coords'] }) {
    const [eta, setEta] = useState<{distance: string; duration: string} | null>(null);

    // Simulate driver's current location somewhere between origin and destination
    const driverLocation = useMemo(() => ({
        lat: origin.lat + (destination.lat - origin.lat) * 0.2, // 20% of the way
        lng: origin.lng + (destination.lng - origin.lng) * 0.2,
    }), [origin, destination]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <MapIcon />
                    Live Route
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="aspect-video w-full overflow-hidden rounded-md border">
                    <Map
                        center={driverLocation}
                        zoom={12}
                        mapId="trackray_driver_map"
                        disableDefaultUI
                    >
                        <Marker position={driverLocation} title="My Location" icon={DRIVER_ICON} />
                        <Marker position={destination} title="Destination" />
                        <Directions origin={driverLocation} destination={destination} setEta={setEta} />
                    </Map>
                 </div>
                 {eta ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                            <CardHeader className="p-0 pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    <Timer className="w-4 h-4" /> Est. Arrival Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-2xl font-bold">{eta.duration}</p>
                            </CardContent>
                        </Card>
                         <Card className="p-4">
                            <CardHeader className="p-0 pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    <Milestone className="w-4 h-4" /> Remaining Distance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-2xl font-bold">{eta.distance}</p>
                            </CardContent>
                        </Card>
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </div>
                 )}
            </CardContent>
        </Card>
    )
}
