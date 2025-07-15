"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { mockOrders } from "@/lib/mock-data";
import { type Order } from "@/lib/types";
import { Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

function FleetMap() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
        <p>Google Maps API Key not configured.</p>
      </div>
    );
  }

  const inTransitOrders = mockOrders.filter(
    (order) => order.status === "In Transit" && order.currentLocation
  );

  const defaultCenter = inTransitOrders.length > 0 ? inTransitOrders[0].currentLocation! : { lat: 39.8283, lng: -98.5795 };

  return (
    <div className="h-[400px] w-full">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={4}
          mapId="admin-fleet-map"
        >
          {inTransitOrders.map((order) => (
            <Marker
              key={order.id}
              position={order.currentLocation!}
              title={`Order ${order.id}`}
            >
                <div className="bg-primary p-2 rounded-full shadow-lg">
                    <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
            </Marker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

export function AdminMap() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Fleet Overview
                </CardTitle>
                <CardDescription>
                Live locations of all trucks currently in transit.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <FleetMap />
            </CardContent>
        </Card>
    )
}
