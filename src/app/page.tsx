
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full font-sans antialiased">
      <div className="hidden md:flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900" />
           <div className="relative z-10 mt-auto max-w-md text-white text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                Bleeding Edge Inventory Management System
            </h1>
            <p className="mt-2 text-white/80">
                TrackRay provides real-time inventory tracking and AI-powered supply chain optimization to keep your warehouse efficient and profitable.
            </p>
          </div>
      </div>

      <div className="flex items-center justify-center p-6 animate-fade-in bg-background">
        <div className="w-full max-w-sm">
            <div className="text-left mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tighter">
                Thonket Warehouse
              </h1>
              <p className="mt-2 text-muted-foreground">Welcome back. Sign in to your dashboard.</p>
            </div>
            <LoginForm />
            <p className="mt-4 text-center text-xs text-muted-foreground">Select a role and click Sign In to enter.</p>
        </div>
      </div>
    </main>
  );
}
