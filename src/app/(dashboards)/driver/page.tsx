
'use client';
// This needs to be a client component to use Suspense with client components.
import DriverDashboard from './page-wrapper';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function DriverDashboardPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return <div className="p-4 text-red-500">Google Maps API Key is missing.</div>;
    }
    
    return (
        <APIProvider apiKey={apiKey}>
            <DriverDashboard />
        </APIProvider>
    );
}
