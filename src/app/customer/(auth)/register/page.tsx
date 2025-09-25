'use client';
import { RegisterForm } from "@/components/customer/register-form";
import { APIProvider } from "@vis.gl/react-google-maps";

const AppLogo = () => (
    <svg role="img" aria-label="Thonket Logo" className="w-auto h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function RegisterPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
         return (
          <div className="container mx-auto p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Configuration Error:</strong>
              <span className="block sm:inline"> The Google Maps API Key is missing. Please add it to your .env file to enable map features.</span>
            </div>
          </div>
        );
    }

    return (
        <>
            <div className="text-left mb-8">
                 <div className="flex items-center gap-3 md:hidden mb-4">
                    <AppLogo />
                     <h1 className="font-headline text-4xl font-bold tracking-tighter">
                        Thonket
                    </h1>
                 </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter">
                    Create an Account
                </h2>
                <p className="mt-2 text-muted-foreground">Join Thonket to start ordering.</p>
            </div>
            <APIProvider apiKey={apiKey}>
                <RegisterForm />
            </APIProvider>
        </>
    );
}
