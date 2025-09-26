
"use client";

import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function TallyConnectionGuide() {
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
            title: "Configure Firewall",
            description: "If you have a firewall enabled on your computer (like Windows Defender), you must create an inbound rule to allow connections on the port you noted in Step 1 (e.g., TCP Port 9000)."
        },
        {
            title: "Keep Tally Running",
            description: "For Tally Force to sync data, your Tally Prime application must be running on your computer, and the configured company must be open."
        }
    ];

    return (
        <div className="space-y-6">
             <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>For Localhost Access Only</AlertTitle>
                <AlertDescription>
                    These instructions are for connecting Thonket to a Tally Prime instance running on the same machine.
                </AlertDescription>
            </Alert>
            <ol className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0 mt-1">{index + 1}</div>
                        <div>
                            <h3 className="font-semibold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <div className="flex items-center gap-2 text-sm text-green-600 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <p>Once completed, Thonket will be able to securely read data and push updates directly to your Tally company.</p>
            </div>
        </div>
    )
}
