'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Map,
  Marker,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Location } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function LocationPicker({
  onLocationConfirm,
}: {
  onLocationConfirm: (location: Location) => void;
}) {
  const [mapCenter, setMapCenter] = useState({ lat: 5.6037, lng: -0.187 }); // Default to Accra
  const [markerPos, setMarkerPos] = useState(mapCenter);
  const [address, setAddress] = useState<string>('Drag the map to set your location');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const geocodingLibrary = useMapsLibrary('geocoding');
  const placesLibrary = useMapsLibrary('places');
  const map = useMap();
  const { toast } = useToast();

  const reverseGeocode = useCallback(async (coords: { lat: number; lng: number }) => {
    if (!geocodingLibrary) return;
    setIsLoading(true);
    const geocoder = new geocodingLibrary.Geocoder();
    try {
      const response = await geocoder.geocode({ location: coords });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    } catch (e) {
      setAddress('Could not fetch address');
    } finally {
      setIsLoading(false);
    }
  }, [geocodingLibrary]);
  
  const handleMapDragEnd = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        const newPos = { lat: center.lat(), lng: center.lng() };
        setMarkerPos(newPos);
        reverseGeocode(newPos);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setMapCenter(newPos);
                setMarkerPos(newPos);
                if (map) map.setCenter(newPos);
                reverseGeocode(newPos);
            },
            () => {
                toast({
                    variant: 'destructive',
                    title: 'Location Error',
                    description: 'Could not get your current location. Please enable permissions.',
                });
                setIsLoading(false);
            }
        );
    }
  };
  
<<<<<<< HEAD
  const handleSearch = () => {
    if (!placesLibrary || !searchQuery || !map) return;
    
    const service = new placesLibrary.PlacesService(map);
=======
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placesLibrary || !searchQuery) return;
    
    const service = new placesLibrary.PlacesService(map!);
>>>>>>> 95ac1cf (Good Start)
    service.findPlaceFromQuery({
        query: searchQuery,
        fields: ['geometry', 'name'],
    }, (results, status) => {
        if (status === placesLibrary.PlacesServiceStatus.OK && results && results[0] && results[0].geometry) {
            const newPos = {
                lat: results[0].geometry.location!.lat(),
                lng: results[0].geometry.location!.lng(),
            };
            setMapCenter(newPos);
            setMarkerPos(newPos);
            map?.setCenter(newPos);
            map?.setZoom(15);
            reverseGeocode(newPos);
        } else {
            toast({ variant: 'destructive', title: 'Search Failed', description: 'Could not find that location.' });
        }
    });
  };

<<<<<<< HEAD
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };


=======
>>>>>>> 95ac1cf (Good Start)
  const handleConfirm = () => {
    onLocationConfirm({
      address: address,
      coords: markerPos,
    });
    toast({
        title: 'Location Confirmed!',
        description: address,
    })
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video w-full">
          <Map
            center={mapCenter}
            zoom={12}
            onDragend={handleMapDragEnd}
            onZoom_changed={handleMapDragEnd}
            disableDefaultUI
            mapId="thonket_location_picker"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <MapPin className="h-10 w-10 text-primary drop-shadow-lg" style={{transform: 'translateY(-50%)'}} />
          </div>
          <div className="absolute top-2 left-2 right-2 flex gap-2">
<<<<<<< HEAD
            <div className="flex-grow relative">
                <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for a location..."
                    className="w-full pl-10 pr-10 bg-white/90"
                />
                <Button type="button" size="icon" variant="ghost" onClick={handleSearch} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
=======
            <form onSubmit={handleSearch} className="flex-grow relative">
                <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a location..."
                    className="w-full pl-10 bg-white/90"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
>>>>>>> 95ac1cf (Good Start)
            <Button type="button" size="icon" onClick={handleUseCurrentLocation} variant="secondary" className="flex-shrink-0 bg-white/90">
                <LocateFixed className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-4 bg-muted/30">
            {isLoading ? <Skeleton className="h-6 w-full" /> : 
             <div className="font-semibold text-center text-muted-foreground">{address}</div>
            }
          <Button onClick={handleConfirm} className="w-full font-bold" disabled={isLoading}>
            Confirm Location
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
