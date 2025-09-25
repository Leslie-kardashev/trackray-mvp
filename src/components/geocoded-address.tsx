
'use client';

import { useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Skeleton } from './ui/skeleton';
import { type Location } from '@/lib/types';

export function GeocodedAddress({ coords, fallbackAddress }: { coords: Location['coords'], fallbackAddress: string }) {
    const [address, setAddress] = useState<string | null>(null);
    const geocodingLibrary = useMapsLibrary('geocoding');

    useEffect(() => {
        if (!geocodingLibrary) return;

        const geocoder = new geocodingLibrary.Geocoder();
        setAddress(null); // Reset on coord change

        geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                // Find a more specific result if possible
                const bestResult = results.find(r => r.types.includes('establishment') || r.types.includes('point_of_interest')) || results[0];
                setAddress(bestResult.formatted_address);
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
                setAddress(fallbackAddress); // Fallback to the generic address
            }
        });

    }, [coords, geocodingLibrary, fallbackAddress]);

    if (!address) {
        return <Skeleton className="h-6 w-3/4" />;
    }

    return <span>{address}</span>;
}
