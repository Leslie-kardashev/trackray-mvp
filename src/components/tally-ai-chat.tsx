
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainCircuit, User, Loader } from "lucide-react";
import { ScrollArea } from './ui/scroll-area';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function TallyAiChat() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        const newUserMessage: Message = { role: 'user', content: query };
        setMessages(prev => [...prev, newUserMessage]);
        setQuery("");
        setIsLoading(true);
        
        // Simulate AI call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockResponse: Message = {
            role: 'assistant',
            content: `This is a mock response for your query: "${query}". The real AI integration has been temporarily rolled back due to API quota limits.`
        };
        setMessages(prev => [...prev, mockResponse]);

        setIsLoading(false);
    };
    
    return (
        <Card className="shadow-lg border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <BrainCircuit className="text-primary"/> AI Finance Assistant
                </CardTitle>
                <CardDescription>
                Ask questions about your financial data in plain English.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72 mb-4 p-4 border rounded-md" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                             <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <BrainCircuit className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                                <div className={`flex-1 space-y-2 pt-1 ${msg.role === 'user' ? 'max-w-sm text-right' : ''}`}>
                                     <p className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-muted' : 'bg-background'}`}>{msg.content}</p>
                                 </div>
                                {msg.role === 'user' && (
                                    <div className="border p-2 rounded-full">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader className="animate-spin w-4 h-4"/> Thinking...
                            </div>
                        )}
                        {messages.length === 0 && !isLoading && (
                            <div className="text-center text-muted-foreground text-sm">
                                Ask a question like "Why did expenses spike in May?" to get started.
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSubmit}>
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Ask a question..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !query}>
                            Ask
                        </Button>
                    </div>
                </form>
                <div className="mt-4 space-y-2 text-sm">
                    <p className="font-semibold text-muted-foreground text-xs">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setQuery("Show cashflow last 3 months")}>Cashflow last 3 months</Button>
                        <Button variant="outline" size="sm" onClick={() => setQuery("Who are my top 5 customers?")}>Top 5 customers</Button>
                        <Button variant="outline" size="sm" onClick={() => setQuery("Detect payment anomalies")}>Detect anomalies</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
