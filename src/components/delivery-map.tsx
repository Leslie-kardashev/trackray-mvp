
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { LocateFixed, MapIcon, Milestone, Timer, XCircle } from 'lucide-react';
import { type Location } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

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
    const [driverLocation, setDriverLocation] = useState<google.maps.LatLngLiteral | null>(origin);
    const [locationError, setLocationError] = useState<string | null>(null);
    const map = useMap();
    const coreLibrary = useMapsLibrary('core');

    const driverIcon = useMemo<google.maps.Symbol | null>(() => {
        if (!coreLibrary) return null;
        return {
            path: 'M2,10.1c0,0,0-0.1,0-0.1s0-0.1,0-0.1c0-2.8,2.2-5,5-5s5,2.2,5,5c0,0,0,0.1,0,0.1s0,0.1,0,0.1H2z M7,12.1 c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S8.7,12.1,7,12.1z M7,7.1C6.4,7.1,6,6.6,6,6.1s0.4-1,1-1s1,0.4,1,1S7.6,7.1,7,7.1z M12.5,10.1H14c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1.5V10.1z M0,10.1h1.5V8.1H0V10.1z',
            fillColor: 'hsl(var(--primary))',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: 'hsl(var(--primary-foreground))',
            rotation: 0,
            scale: 1.8,
            anchor: new coreLibrary.Point(7, 10),
        };
    }, [coreLibrary]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }

        let watcher = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLocation = { lat: latitude, lng: longitude };
                setDriverLocation(newLocation);
                setLocationError(null);
                // Optional: Recenter the map on the driver
                if (map) {
                    map.panTo(newLocation);
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationError("Location access denied. Please enable location permissions to use live tracking.");
                } else {
                    setLocationError("Could not get your location. Please check your device settings.");
                }
                console.error("Geolocation error:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        // Cleanup watcher on component unmount
        return () => navigator.geolocation.clearWatch(watcher);

    }, [map]);


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <MapIcon />
                    Live Route
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 {locationError && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Tracking Error</AlertTitle>
                        <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                 )}
                 <div className="aspect-video w-full overflow-hidden rounded-md border">
                    <Map
                        center={driverLocation || origin}
                        zoom={14}
                        mapId="trackray_driver_map"
                        disableDefaultUI
                    >
                       {driverLocation && driverIcon && (
                         <>
                            <Marker position={driverLocation} title="My Location" icon={driverIcon} />
                            <Marker position={destination} title="Destination" />
                            <Directions origin={driverLocation} destination={destination} setEta={setEta} />
                         </>
                       )}
                    </Map>
                 </div>
                 {eta ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                 ) : driverLocation ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </div>
                 ) : (
                    <Card className="p-4 flex flex-col items-center justify-center text-center h-24">
                        <LocateFixed className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground font-medium">Waiting for location...</p>
                    </Card>
                 )}
            </CardContent>
        </Card>
    )
}
