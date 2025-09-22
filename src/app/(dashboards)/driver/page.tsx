
'use client';
// This needs to be a client component to use Suspense with client components.
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DriverDashboard from './page-wrapper';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function DriverDashboardPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return <div className="p-4 text-red-500">Google Maps API Key is missing.</div>;
    }
    
    return (
        <APIProvider apiKey={apiKey}>
            <Suspense fallback={<DashboardSkeleton />}>
                <DriverDashboard />
            </Suspense>
        </APIProvider>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1 w-full">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
}
