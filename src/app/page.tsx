
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-4xl grid-cols-1 md:grid-cols-2 lg:grid rounded-2xl border shadow-lg overflow-hidden">
        <div className="relative hidden lg:block">
            <Image
                src="https://placehold.co/600x800.png"
                alt="Truck on a highway"
                data-ai-hint="delivery truck highway"
                width={600}
                height={800}
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
             <div className="absolute bottom-8 left-8">
                <h1 className="font-headline text-5xl font-bold tracking-tighter text-white">
                    TrackRay
                </h1>
                <p className="mt-2 text-white/90 max-w-sm">
                    The future of fleet management, powered by AI.
                </p>
            </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 md:p-12 animate-fade-in">
             <div className="w-full max-w-sm space-y-6">
                <div className="text-center lg:hidden">
                    <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary">
                        TrackRay
                    </h1>
                </div>
                <LoginForm />
                <p className="text-center text-xs text-muted-foreground">
                    Select a role and click Sign In to enter a dashboard.
                </p>
            </div>
        </div>
      </div>
    </main>
  );
}
