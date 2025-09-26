
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full font-sans antialiased">
      <div className="hidden md:flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
           <Image
              src="https://picsum.photos/seed/3/1200/1800"
              alt="Warehouse background"
              fill
              className="object-cover"
              data-ai-hint="warehouse logistics"
            />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
           <div className="relative z-10 mt-auto max-w-md text-white text-left">
            <h1 className="font-headline text-5xl font-bold tracking-tight">
                Cutting Edge OverSight
            </h1>
            <p className="mt-4 text-lg text-white/80">
                Thonket provides AI-powered financial analysis and oversight, giving you unprecedented clarity and control over your Tally data.
            </p>
          </div>
      </div>

      <div className="flex items-center justify-center p-6 animate-fade-in bg-background">
        <div className="w-full max-w-sm">
            <div className="text-left mb-8">
               <div className="flex items-center gap-4 mb-4 text-foreground">
                <svg role="img" aria-label="TrackRay Logo" className="w-auto h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-headline text-2xl font-bold tracking-tighter">Thonket</span>
                <Badge variant="outline">Finance Terminal</Badge>
              </div>
              <h1 className="font-headline text-3xl font-bold tracking-tighter">
                Agent Portal
              </h1>
              <p className="mt-2 text-muted-foreground">Enter your credentials to access your dashboard.</p>
            </div>
            <LoginForm />
        </div>
      </div>
    </main>
  );
}
