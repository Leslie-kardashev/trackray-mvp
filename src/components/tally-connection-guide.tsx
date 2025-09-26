
"use client";

import { useState } from 'react';
import { CheckCircle, AlertTriangle, RefreshCw, XCircle, ShieldQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

type ConnectionStatus = 'untested' | 'testing' | 'connected' | 'disconnected';

export function TallyConnectionGuide() {
    const [status, setStatus] = useState<ConnectionStatus>('untested');
    const { toast } = useToast();

    const handleTestConnection = async () => {
        setStatus('testing');
        try {
            const response = await fetch('/api/tally/test');
            const data = await response.json();

            if (response.ok) {
                setStatus('connected');
                toast({
                    title: "Connection Successful!",
                    description: "Successfully connected to your Tally Prime instance.",
                    variant: 'default',
                });
            } else {
                throw new Error(data.message || 'Failed to connect.');
            }
        } catch (error) {
            setStatus('disconnected');
            toast({
                title: "Connection Failed",
                description: error.message || "Could not connect to Tally. Please check the guide and try again.",
                variant: 'destructive',
            });
        }
    };

    const statusInfo = {
        untested: { text: "Untested", color: "text-muted-foreground", icon: <AlertTriangle className="h-4 w-4" /> },
        testing: { text: "Testing...", color: "text-blue-500", icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
        connected: { text: "Connected", color: "text-green-600", icon: <CheckCircle className="h-4 w-4" /> },
        disconnected: { text: "Disconnected", color: "text-destructive", icon: <XCircle className="h-4 w-4" /> },
    };

    const steps = [
        {
            title: "Enable ODBC Server",
            description: "In Tally Prime, press F1 (Help) > Settings > Connectivity > Client/Server Configuration. Set 'Tally Prime acts as' to 'Both' and ensure 'Enable ODBC Server' is set to 'Yes'. Note the port number (default is 9000)."
        },
        {
            title: "Set Company to Load on Startup",
            description: "Press F1 (Help) > Settings > Startup. Set 'Load companies on startup' to 'Yes' and select your primary company. This ensures data is always available when Tally is running."
        },
        {
            title: "Configure Inbound Firewall Rule",
            description: "If you have a firewall enabled on your computer (like Windows Defender), you must create an inbound rule to allow connections on the port you noted in Step 1 (e.g., TCP Port 9000).",
            details: (
                <div className="space-y-3 text-xs pl-6 pt-2 pb-1">
                    <p><strong>1. Open Windows Security:</strong> Click the Start button, type "Windows Security", and open the app.</p>
                    <p><strong>2. Go to Advanced Settings:</strong> Click on "Firewall & network protection", then "Advanced settings".</p>
                    <p><strong>3. New Inbound Rule:</strong> Click "Inbound Rules" on the left, then "New Rule..." on the right.</p>
                    <p><strong>4. Port Type:</strong> Select "Port" and click Next.</p>
                    <p><strong>5. Specify Port:</strong> Select "TCP" and in "Specific local ports", enter <strong>9000</strong> (or your custom port). Click Next.</p>
                    <p><strong>6. Action:</strong> Select "Allow the connection" and click Next.</p>
                    <p><strong>7. Profile:</strong> Keep "Domain" and "Private" checked. Click Next.</p>
                    <p><strong>8. Name Rule:</strong> Name it something memorable, like `Tally Prime Access`. Click Finish.</p>
                </div>
            )
        },
        {
            title: "Keep Tally Running",
            description: "For Tally Force to sync data, your Tally Prime application must be running on your computer, and the configured company must be open."
        }
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Connection Status</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                     <div className={cn("flex items-center gap-2 font-semibold", statusInfo[status].color)}>
                        {statusInfo[status].icon}
                        <span>Status: {statusInfo[status].text}</span>
                    </div>
                    <Button onClick={handleTestConnection} disabled={status === 'testing'}>
                        <RefreshCw className="mr-2" /> Test Connection
                    </Button>
                </CardContent>
            </Card>
             <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>For Localhost Access Only</AlertTitle>
                <AlertDescription>
                    These instructions are for connecting Thonket to a Tally Prime instance running on the same machine.
                </AlertDescription>
            </Alert>
            <ol className="space-y-1">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-4 p-2 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0 mt-1">{index + 1}</div>
                        <div className="w-full">
                            <h3 className="font-semibold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            {step.details && (
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1" className="border-b-0">
                                        <AccordionTrigger className="text-xs -ml-2 py-1 text-primary hover:no-underline">Show me how</AccordionTrigger>
                                        <AccordionContent>
                                            {step.details}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
            <div className="flex items-center gap-2 text-sm text-green-600 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <p>Once completed, Thonket will be able to securely read data and push updates directly to your Tally company.</p>
            </div>

             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <ShieldQuestion className="text-primary"/> Troubleshooting
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="gateway-error">
                            <AccordionTrigger>Seeing an "Unable to connect to Tally Gateway" error in Tally?</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <p className="text-sm text-muted-foreground">This error usually means Tally Prime itself cannot access the internet. Here’s how to fix it by creating an **outbound** firewall rule:</p>
                                <ol className="space-y-2 text-xs list-decimal pl-5">
                                    <li>Open **Windows Security** > **Firewall & network protection** > **Advanced settings**.</li>
                                    <li>Click on **Outbound Rules** on the left, then **New Rule...** on the right.</li>
                                    <li>Select **Program** and click Next.</li>
                                    <li>Click **Browse...** and find your Tally application (usually `C:\Program Files\TallyPrime\tally.exe`). Click Next.</li>
                                    <li>Ensure **Allow the connection** is selected. Click Next three times.</li>
                                    <li>Give the rule a name like `Tally Prime Outbound Access` and click **Finish**.</li>
                                    <li>Restart Tally Prime.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}

    