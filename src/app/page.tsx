
import { LoginForm } from '@/components/login-form';

export default function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full font-sans antialiased">
      <div className="hidden md:flex flex-col items-center justify-center p-10 text-center relative overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
           <div className="relative z-10 mt-auto max-w-md text-white text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                Engineered for Performance.
            </h1>
            <p className="mt-2 text-white/80">
                TrackRay provides real-time fleet management and AI-powered route optimization to keep your deliveries on schedule and under budget.
            </p>
          </div>
      </div>

      <div className="flex items-center justify-center p-6 animate-fade-in bg-background">
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter">
                TrackRay
              </h1>
            </div>
            <LoginForm />
        </div>
      </div>
    </main>
  );
}
