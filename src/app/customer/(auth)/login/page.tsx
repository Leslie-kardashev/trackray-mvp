import { LoginForm } from "@/components/customer/login-form";

const AppLogo = () => (
    <svg role="img" aria-label="Thonket Logo" className="w-auto h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L25 30 L40 70 L55 30 L70 70 L85 30 L95 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 65 L25 25 L40 65 L55 25 L70 65 L85 25 L95 35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default function LoginPage() {
    return (
        <>
            <div className="text-left mb-8">
                 <div className="flex items-center gap-3 md:hidden mb-4">
                    <AppLogo />
                    <h1 className="font-headline text-4xl font-bold tracking-tighter">
                        Thonket
                    </h1>
                 </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter">
                    Sign In
                </h2>
                <p className="mt-2 text-muted-foreground">Welcome back. Please enter your credentials.</p>
            </div>
            <LoginForm />
        </>
    );
}
