
'use client';
// This needs to be a client component to use Suspense with client components.
import DriverDashboard from './page-wrapper';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function DriverDashboardPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return (
          <div className="container mx-auto p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Configuration Error:</strong>
              <span className="block sm:inline"> The Google Maps API Key is missing. Please add your key to the `.env` file to enable map features.</span>
            </div>
          </div>
        );
    }
    
    return (
        <APIProvider apiKey={apiKey}>
            <DriverDashboard />
        </APIProvider>
    );
}
