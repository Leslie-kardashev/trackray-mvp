
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from './ui/alert';

export function FinanceAIAssistant() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setIsLoading(true);
        setResponse(null);
        // Simulate AI call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        // This is where you would call your AI backend.
        // For the demo, we show a canned response.
    };

    return (
        <Card className="shadow-lg border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <BrainCircuit className="text-primary"/> Thonket Finance Assistant
                </CardTitle>
                <CardDescription>
                Ask questions about your financial data in plain English.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="e.g., Why did expenses spike in May?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Thinking..." : "Ask"}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 space-y-2 text-sm">
                    <p className="font-semibold text-muted-foreground">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setQuery("Show me cashflow last 3 months")}>Cashflow last 3 months</Button>
                        <Button variant="outline" size="sm" onClick={() => setQuery("Who are my top 5 customers by revenue?")}>Top 5 customers</Button>
                        <Button variant="outline" size="sm" onClick={() => setQuery("Detect anomalies in payments from last week")}>Detect payment anomalies</Button>
                    </div>
                </div>

                {isLoading && (
                    <div className="mt-4 text-center">
                        <p className="text-muted-foreground">Analyzing data...</p>
                    </div>
                )}
            </CardContent>
             <CardFooter>
                 <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                        The AI assistant uses a read-only mirror of your Tally data for analysis.
                    </AlertDescription>
                </Alert>
            </CardFooter>
        </Card>
    );
}

