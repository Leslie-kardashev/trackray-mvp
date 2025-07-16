
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full font-sans antialiased">
      <div className="hidden md:flex flex-col items-center justify-center bg-muted/40 p-10 text-center border-r">
          <div className="relative w-full h-full max-w-md mx-auto">
            <Image 
                src="https://placehold.co/600x400.png"
                alt="Delivery truck on a highway"
                fill
                style={{objectFit: "contain"}}
                className="rounded-lg"
                data-ai-hint="logistics truck"
            />
          </div>
          <div className="mt-6 max-w-md">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
                Optimize Your Operations, Instantly.
            </h1>
            <p className="mt-2 text-muted-foreground">
                TrackRay provides real-time fleet management and AI-powered route optimization to keep your deliveries on schedule and under budget.
            </p>
          </div>
      </div>

      <div className="flex items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-sm">
            <div className="text-left mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tighter">
                TrackRay
              </h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back. Sign in to your dashboard.
              </p>
            </div>
            <LoginForm />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Select a role and click Sign In to enter.
            </p>
        </div>
      </div>
    </main>
  );
}
