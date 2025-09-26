
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainCircuit, User, Loader } from "lucide-react";
import { ScrollArea } from './ui/scroll-area';
import { explainFinancials, type ExplainFinancialsOutput } from '@/ai/flows/explain-financials';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  data?: ExplainFinancialsOutput['data'];
  chartHint?: ExplainFinancialsOutput['chartHint'];
  sql?: string;
};


function ChartRenderer({ data, chartHint }: { data: any[], chartHint: ExplainFinancialsOutput['chartHint'] }) {
    if (!data || !chartHint) return null;

    const { type, x, y } = chartHint;
    const yKey = Array.isArray(y) ? y[0] : y;
    const yKey2 = Array.isArray(y) && y.length > 1 ? y[1] : null;

    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

    return (
        <div className="h-48 w-full my-4">
            <ResponsiveContainer>
                {type === 'bar' && (
                     <BarChart data={data}>
                        <XAxis dataKey={x} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                        <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                        <Bar dataKey={yKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )}
                 {type === 'line' && (
                    <LineChart data={data}>
                        <XAxis dataKey={x} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                        <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                        <Line type="monotone" dataKey={yKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={false}/>
                        {yKey2 && <Line type="monotone" dataKey={yKey2} stroke="hsl(var(--destructive))" strokeWidth={2} dot={false}/>}
                    </LineChart>
                )}
                 {type === 'pie' && (
                    <PieChart>
                        <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                        <Pie data={data} dataKey={yKey} nameKey={x} cx="50%" cy="50%" outerRadius={60} label={(props) => `${(props.percent * 100).toFixed(0)}%`}>
                             {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}

const AssistantMessage = ({ msg }: { msg: Message }) => (
    <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
            <BrainCircuit className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3 pt-1">
            {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}

            {msg.chartHint && msg.data && <ChartRenderer data={msg.data} chartHint={msg.chartHint} />}
            
            {msg.sql && (
                <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">View SQL Query</summary>
                    <pre className="mt-2 bg-muted p-2 rounded-md font-mono text-xs overflow-x-auto">{msg.sql}</pre>
                </details>
            )}
        </div>
    </div>
);

const UserMessage = ({ msg }: { msg: Message }) => (
    <div className="flex items-start gap-3 justify-end">
         <div className="flex-1 space-y-2 pt-1 max-w-sm">
             <p className="bg-muted p-3 rounded-lg text-sm">{msg.content}</p>
         </div>
        <div className="border p-2 rounded-full">
            <User className="w-5 h-5" />
        </div>
    </div>
);


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

    const handleSubmit = async (e: React.FormEvent, suggestedQuery?: string) => {
        e.preventDefault();
        const currentQuery = suggestedQuery || query;
        if (!currentQuery) return;

        const newUserMessage: Message = { role: 'user', content: currentQuery };
        setMessages(prev => [...prev, newUserMessage]);
        setQuery("");
        setIsLoading(true);

        try {
            const response = await explainFinancials(currentQuery);
            
            const assistantMessage: Message = {
                role: 'assistant',
                content: response.summary,
                data: response.data,
                chartHint: response.chartHint,
                sql: response.sql,
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error: any) {
            console.error("AI flow error:", error);
            let errorMessageText = 'Sorry, I encountered an error trying to process your request.';
            if (error.message && error.message.includes('429')) {
                errorMessageText = 'The AI model is currently experiencing high traffic. This might be due to API rate limits on your project. Please try again in a moment, or check your Google Cloud project to ensure the "generativelanguage.googleapis.com" API is enabled and has sufficient quota.';
            }
            const errorMessage: Message = { role: 'assistant', content: errorMessageText };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
                            msg.role === 'user' ? <UserMessage key={i} msg={msg} /> : <AssistantMessage key={i} msg={msg} />
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
                        <Button variant="outline" size="sm" onClick={(e) => handleSubmit(e, "Show cashflow last 3 months")}>Cashflow last 3 months</Button>
                        <Button variant="outline" size="sm" onClick={(e) => handleSubmit(e, "Who are my top 5 customers?")}>Top 5 customers</Button>
                        <Button variant="outline" size="sm" onClick={(e) => handleSubmit(e, "Detect payment anomalies")}>Detect anomalies</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
