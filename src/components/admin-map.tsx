"use client";

import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { mockOrders } from "@/lib/mock-data";
import { type Order } from "@/lib/types";
import { Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState, useEffect } from "react";

// Function to simulate a truck moving along a path
const moveTruck = (
  current: { lat: number, lng: number },
  destination: { lat: number, lng: number },
  speed = 0.01 // Adjust for faster/slower simulation
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

function FleetMap() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const map = useMap();

    useEffect(() => {
        const interval = setInterval(() => {
            setOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                    if (order.status === 'In Transit' && order.currentLocation) {
                        const newLocation = moveTruck(order.currentLocation, order.destination.coords);
                        return { ...order, currentLocation: newLocation };
                    }
                    return order;
                });
                return updatedOrders;
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!map) return;
        const inTransitOrders = orders.filter(order => order.status === 'In Transit' && order.currentLocation);
        if (inTransitOrders.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        inTransitOrders.forEach(order => {
            if(order.currentLocation) {
                bounds.extend(new google.maps.LatLng(order.currentLocation.lat, order.currentLocation.lng));
            }
        });
        if(bounds.isEmpty()) {
             map.setCenter({ lat: 39.8283, lng: -98.5795 });
             map.setZoom(4);
        } else {
            map.fitBounds(bounds);
        }
    }, [orders, map]);


  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
        <p>Google Maps API Key not configured.</p>
      </div>
    );
  }

  const inTransitOrders = orders.filter(
    (order) => order.status === "In Transit" && order.currentLocation
  );
  
  return (
      <>
        {inTransitOrders.map((order) => (
            <Marker
                key={order.id}
                position={order.currentLocation!}
                title={`Order ${order.id}`}
            >
                <div className="bg-primary p-2 rounded-full shadow-lg animate-pulse">
                    <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
            </Marker>
        ))}
    </>
  );
}

export function AdminMap() {
    const initialCenter = { lat: 39.8283, lng: -98.5795 };
    return (
        <Card className="shadow-sm h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Live Fleet Overview
                </CardTitle>
                <CardDescription>
                Real-time locations of all trucks currently in transit.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                        <Map
                        defaultCenter={initialCenter}
                        defaultZoom={4}
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
