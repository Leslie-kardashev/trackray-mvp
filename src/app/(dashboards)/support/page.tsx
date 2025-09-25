
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.06 10.84c-.2.2-.48.3-1.09.05-.6-.25-1.28-.75-1.88-1.36-.6-.6-1.1-1.28-1.35-1.88-.25-.6.05-.9.25-1.1.2-.2.43-.25.6-.25h.3c.18 0 .36.05.5.25l.89.89c.15.15.2.35.05.55l-.3.48c-.15.2-.15.4.05.55l.68.68c.2.2.45.2.6.05l.48-.3c.2-.15.4-.1.55.05l.89.89c.2.2.25.38.25.55v.3c0 .2-.05.4-.25.6zM12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18.2a8.2 8.2 0 1 1 8.2-8.2 8.2 8.2 0 0 1-8.2 8.2zm4.5-6.04c-.38-.2-2.23-1.1-2.58-1.22-.35-.12-.6-.2-1 .2-.38.38-.98.98-1.2 1.2-.22.22-.43.25-.8.05-1.6-1-2.93-2.33-3.93-3.93-.2-.35-.05-.58.12-.78.15-.18.35-.38.5-.55.12-.15.2-.25.3-.4.1-.15.05-.3-.02-.42l-1.22-2.9c-.12-.3-.25-.38-.42-.38h-.42c-.2 0-.45.05-.65.25-.2.2-.78.78-.78 1.88 0 1.1.8 2.18 1.2 2.55.38.35 2.48 3.98 6.02 5.3 3.55 1.32 3.55.9 4.2.88.65-.02 2.02-.82 2.3-1.6.28-.78.28-1.45.2-1.58-.08-.13-.28-.2-.55-.38z"/>
    </svg>
)

export default function SupportPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Support</h1>
                <p className="text-muted-foreground">
                Get help or contact us for any issues.
                </p>
            </div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Need Immediate Help?</CardTitle>
                    <CardDescription>Use the buttons below to contact our support team directly for urgent issues.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild size="lg" className="h-16 text-lg">
                        <a href="tel:+233240000000">
                            <Phone className="mr-4" /> Call Support
                        </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-16 text-lg border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                        <a href="https://wa.me/233240000000" target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon className="mr-4 h-6 w-6 fill-current" /> Chat on WhatsApp
                        </a>
                    </Button>
                </CardContent>
            </Card>
             <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                   <p><strong>Q: How do I reset my passcode?</strong></p>
                   <p>A: For security reasons, you must contact your administrator at the management terminal to have your passcode reset.</p>
                   <p><strong>Q: An order is not appearing in my list. What do I do?</strong></p>
                   <p>A: First, ensure you have a stable internet connection. If the issue persists, contact support via phone or WhatsApp with the Order ID.</p>
                </CardContent>
            </Card>
        </div>
    );
}
