
"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { getOrders, updateTruckLocations } from "@/lib/data-service";
import { type Order } from "@/lib/types";
import { Truck, Warehouse, Package, CirclePause, Undo2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

function Directions({ order, isFaded }: { order: Order, isFaded: boolean }) {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsRenderer(new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, 
      polylineOptions: {
        strokeColor: order.routeColor || '#1a73e8',
        strokeOpacity: isFaded ? 0.3 : 0.8,
        strokeWeight: 6,
      },
    }));
  }, [map, order.routeColor]);

  useEffect(() => {
    if (!directionsRenderer) return;
    
    // Update polyline options when isFaded or color changes
    directionsRenderer.setOptions({
        polylineOptions: {
            strokeColor: order.routeColor || '#1a73e8',
            strokeOpacity: isFaded ? 0.3 : 0.8,
            strokeWeight: 6,
        }
    });

  }, [isFaded, directionsRenderer, order.routeColor]);


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
        console.error(`Directions request failed for order ${order.id} due to ${status}`);
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

const TruckMarker = ({ order, isFaded, onClick, onMouseOver, onMouseOut }: { order: Order; isFaded: boolean; onClick: () => void; onMouseOver: () => void; onMouseOut: () => void; }) => {
    const wrapperClasses = cn("p-2 rounded-full shadow-lg border-2 border-white transition-opacity", isFaded ? "opacity-50" : "opacity-100");
    
    const markerContent = () => {
        switch (order.status) {
            case 'Moving':
                return (
                    <div className={cn(wrapperClasses, "bg-blue-500 animate-pulse")}>
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                );
            case 'Returning':
                return (
                    <div className={cn(wrapperClasses, "bg-orange-500")}>
                        <Undo2 className="w-5 h-5 text-white" />
                    </div>
                );
            case 'Idle':
                return (
                    <div className={cn(wrapperClasses, "bg-gray-500")}>
                        <CirclePause className="w-5 h-5 text-white" />
                    </div>
                );
            default:
                return null; // Don't render marker for Pending, Delivered, etc.
        }
    };

    if (!order.currentLocation) return null;

    return (
        <Marker position={order.currentLocation} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            {markerContent()}
        </Marker>
    );
};


function FleetMap() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
    const map = useMap();

    useEffect(() => {
        const fetchAndUpdateLocations = async () => {
            const updatedOrders = await updateTruckLocations();
            setOrders(updatedOrders);
        };
        
        // Fetch initial data
        getOrders().then(setOrders);

        // Update every second
        const interval = setInterval(fetchAndUpdateLocations, 1000); 

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
        {activeOrders.map((order) => {
            const isFaded = hoveredOrderId !== null && hoveredOrderId !== order.id;
            return (
              <React.Fragment key={order.id}>
                <TruckMarker
                    order={order}
                    isFaded={isFaded}
                    onClick={() => setActiveMarkerId(order.id)}
                    onMouseOver={() => setHoveredOrderId(order.id)}
                    onMouseOut={() => setHoveredOrderId(null)}
                />
                <Directions order={order} isFaded={isFaded} />
              </React.Fragment>
            );
        })}

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
