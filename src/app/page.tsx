
import { LoginForm } from '@/components/login-form';

const AuthLogo = () => (
    <svg role="img" aria-label="TrackRay Logo" className="w-16 h-16 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M85.9439 17.4439C87.8189 15.5689 90.1811 15.5689 92.0561 17.4439C93.9311 19.3189 93.9311 22.2899 92.0561 24.1649L89.2271 26.9929L81.5071 19.2729L85.9439 17.4439Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12.5 83C12.5 83 15.5 61.5 27 53.5C38.5 45.5 41 68 52.5 60C64 52 65 74.5 77.5 66.5C84.0674 62.2204 88.5132 51.4932 89.227 44.493" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 80C12.5 80 15.5 58.5 27 50.5C38.5 42.5 41 65 52.5 57C64 49 65 71.5 77.5 63.5C84.0674 59.2204 88.5132 48.4932 89.227 41.493" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


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
            <div className="text-center flex flex-col items-center gap-2">
              <AuthLogo />
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
