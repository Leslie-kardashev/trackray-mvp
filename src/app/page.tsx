import { LoginForm } from '@/components/login-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary sm:text-6xl">
            TrackRay
          </h1>
          <p className="mt-2 text-muted-foreground">
            AI-Powered Logistics & Fleet Management
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground">
          Select a role and click Sign In to enter a dashboard.
        </p>
      </div>
    </main>
  );
}
