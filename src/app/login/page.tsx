
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full font-sans antialiased">
      <div className="hidden md:flex flex-col items-center justify-between p-10 text-white bg-gradient-to-br from-purple-900 to-blue-900 relative overflow-hidden">
           <div className="relative z-10 w-full max-w-md text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                TrackRay
            </h1>
            <p className="mt-2 text-white/80">
                Your Co-Pilot for the Road.
            </p>
           </div>
           <div className="relative z-10 mt-auto max-w-md text-left self-start">
            <p className="mt-2 text-white/80 text-sm">
                Accept deliveries, navigate with optimized routes, and confirm drop-offs all in one place. Let's get moving.
            </p>
          </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 animate-fade-in bg-background">
        <div className="w-full max-w-sm">
            <div className="text-left mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tighter">
                Driver Login
              </h1>
              <p className="mt-2 text-muted-foreground">Sign in to view your assigned deliveries.</p>
            </div>
            <LoginForm />
        </div>
      </div>
    </main>
  );
}

