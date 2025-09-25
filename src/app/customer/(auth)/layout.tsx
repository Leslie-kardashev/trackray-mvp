import Image from "next/image";

const AppLogo = () => (
    <svg role="img" aria-label="Thonket Logo" className="w-auto h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full font-sans antialiased">
            <div className="hidden md:flex flex-col items-center justify-between p-10 text-white bg-gradient-to-br from-purple-900 to-indigo-900 relative overflow-hidden">
                <div className="relative z-10 w-full max-w-md text-left self-start flex items-center gap-3">
                    <AppLogo />
                     <h1 className="font-headline text-3xl font-bold tracking-tight">
                        Thonket
                    </h1>
                </div>
                <div className="relative z-10 mt-auto max-w-md text-left self-start">
                    <h2 className="text-4xl font-bold font-headline tracking-tight">
                        Everything you need, delivered to your door.
                    </h2>
                    <p className="mt-4 text-white/80 text-lg">
                        From your favorite groceries to essential business supplies, Thonket is the one-stop shop for individuals and businesses across Ghana.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 md:p-10 animate-fade-in bg-background overflow-y-auto">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </main>
    );
}
