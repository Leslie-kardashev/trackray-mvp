
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
                Driver
            </p>
           </div>
           <div className="relative z-10 mt-auto max-w-md text-left self-start">
            <p className="mt-2 text-white/80 text-sm">
               Engineered for Performance. TrackRay provides real-time fleet management and AI-powered route optimization to keep your deliveries on schedule and under budget.
            </p>
          </div>
      </div>


      <div className="flex flex-col items-center justify-center p-6 animate-fade-in bg-background">
        <div className="w-full max-w-sm">
            <div className="text-left mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tighter">
                Sign In
              </h1>
              <p className="mt-2 text-muted-foreground">Welcome back. Select a role to sign in.</p>
            </div>
            <LoginForm />
             <p className="mt-4 text-center text-xs text-muted-foreground">This is a demo app. Select a role and click Sign In.</p>
        </div>
      </div>
    </main>
  );
}
