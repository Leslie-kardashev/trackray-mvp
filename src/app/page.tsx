
import { LoginForm } from '@/components/login-form';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      {/* Background Shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/30 to-purple-400/30 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 opacity-60 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-400/30 to-primary/30 opacity-40 blur-3xl"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
        <div className="flex flex-col items-center justify-center animate-fade-in">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="font-headline text-5xl font-bold tracking-tighter text-white drop-shadow-md">
                TrackRay
              </h1>
              <p className="mt-2 text-white/80">
                The future of fleet management, powered by AI.
              </p>
            </div>
            <LoginForm />
            <p className="text-center text-xs text-white/60">
              Select a role and click Sign In to enter a dashboard.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
