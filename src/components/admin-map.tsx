
"use client";

import { APIProvider, Map, Marker, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { mockOrders } from "@/lib/mock-data";
import { type Order } from "@/lib/types";
import { Truck, Warehouse, Package, CirclePause, Undo2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState, useEffect } from "react";

// Function to simulate a truck moving along a path
const moveTruck = (
  current: { lat: number, lng: number },
  destination: { lat: number, lng: number },
  speed = 0.001 // Adjust for faster/slower simulation
) => {
  const latDiff = destination.lat - current.lat;
  const lngDiff = destination.lng - current.lng;
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

  if (distance < speed) {
    return destination;
  }

  const newLat = current.lat + (latDiff / distance) * speed;
  const newLng = current.lng + (lngDiff / distance) * speed;
  return { lat: newLat, lng: newLng };
};

function Directions({ order }: { order: Order }) {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsRenderer(new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, 
      polylineOptions: {
        strokeColor: order.routeColor || '#1a73e8',
        strokeOpacity: 0.8,
        strokeWeight: 6,
      },
    }));
  }, [map, order.routeColor]);

  useEffect(() => {
    if (!directionsRenderer || !order.currentLocation) return;

    const directionsService = new google.maps.DirectionsService();
    const origin = order.status === 'Returning' ? order.destination.coords : order.pickup.coords;
    const destination = order.status === 'Returning' ? order.pickup.coords : order.destination.coords;


    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
    
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setDirections({routes: []});
      }
    };
  // We only want to run this once when the component mounts and the order is available.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directionsRenderer]);

  return null;
}

const TruckMarker = ({ order, onClick }: { order: Order; onClick: () => void }) => {
    switch (order.status) {
        case 'Moving':
            return (
                <Marker position={order.currentLocation!} onClick={onClick}>
                    <div className="bg-blue-500 p-2 rounded-full shadow-lg border-2 border-white animate-pulse">
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                </Marker>
            );
        case 'Returning':
            return (
                <Marker position={order.currentLocation!} onClick={onClick}>
                    <div className="bg-yellow-500 p-2 rounded-full shadow-lg border-2 border-white">
                        <Undo2 className="w-5 h-5 text-white" />
                    </div>
                </Marker>
            );
        case 'Idle':
            return (
                <Marker position={order.currentLocation!} onClick={onClick}>
                    <div className="bg-gray-500 p-2 rounded-full shadow-lg border-2 border-white">
                        <CirclePause className="w-5 h-5 text-white" />
                    </div>
                </Marker>
            );
        default:
            return null;
    }
};


function FleetMap() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const map = useMap();

    useEffect(() => {
        const interval = setInterval(() => {
            setOrders(prevOrders => {
                return prevOrders.map(order => {
                    if ((order.status === 'Moving' || order.status === 'Returning') && order.currentLocation) {
                        const destination = order.status === 'Returning' ? order.pickup.coords : order.destination.coords;
                        const newLocation = moveTruck(order.currentLocation, destination);
                        
                        let newStatus = order.status;
                        if(newLocation.lat === destination.lat && newLocation.lng === destination.lng) {
                           newStatus = order.status === 'Moving' ? 'Delivered' : 'Idle';
                        }
                        return { ...order, currentLocation: newLocation, status: newStatus };
                    }
                    return order;
                });
            });
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!map || activeMarkerId) return;
        const activeOrders = orders.filter(order => ['Moving', 'Idle', 'Returning'].includes(order.status) && order.currentLocation);
        if (activeOrders.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        activeOrders.forEach(order => {
            if(order.currentLocation) {
                bounds.extend(new google.maps.LatLng(order.currentLocation.lat, order.currentLocation.lng));
            }
        });
        if(bounds.isEmpty()) {
             map.setCenter({ lat: 7.9465, lng: -1.0232 }); // Center of Ghana
             map.setZoom(7);
        } else {
            map.fitBounds(bounds);
        }
    }, [orders, map, activeMarkerId]);


  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p>Google Maps API Key not configured.</p>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (order) => ['Moving', 'Idle', 'Returning'].includes(order.status) && order.currentLocation
  );
  
  const activeOrderForInfoWindow = activeOrders.find(o => o.id === activeMarkerId);
  
  return (
      <>
        {activeOrders.map((order) => (
            <TruckMarker key={order.id} order={order} onClick={() => setActiveMarkerId(order.id)} />
        ))}

        {activeMarkerId && activeOrderForInfoWindow && (
             <InfoWindow
                position={activeOrderForInfoWindow.currentLocation!}
                onCloseClick={() => setActiveMarkerId(null)}
                >
                <div className="p-2 font-semibold">
                    <p>Truck: {activeOrderForInfoWindow.id}</p>
                    <p className="text-sm text-muted-foreground">Status: {activeOrderForInfoWindow.status}</p>
                </div>
            </InfoWindow>
        )}
        
         {activeOrders.map((order) => (
            <Directions key={`dir-${order.id}`} order={order} />
        ))}
    </>
  );
}

export function AdminMap() {
    const initialCenter = { lat: 7.9465, lng: -1.0232 }; // Center of Ghana
    return (
        <Card className="shadow-sm h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Live Fleet Overview
                </CardTitle>
                <CardDescription>
                Real-time locations of all trucks currently active in Ghana.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full min-h-[500px]">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                        <Map
                        defaultCenter={initialCenter}
                        defaultZoom={7}
                        mapId="admin-fleet-map"
                        gestureHandling="greedy"
                        className="h-full rounded-b-lg"
                        >
                            <FleetMap />
                        </Map>
                    </APIProvider>
                ) : (
                    <div className="flex items-center justify-center h-full bg-muted rounded-b-lg">
                        <p>Google Maps API Key not configured.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
