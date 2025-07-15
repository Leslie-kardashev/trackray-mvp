"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestRoute, type SuggestRouteOutput } from "@/ai/flows/suggest-route";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, Sparkles, MapPin, Clock, Lightbulb, CornerUpLeft, CornerUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  currentLocation: z.string().min(1, "Current location is required."),
  destination: z.string().min(1, "Destination is required."),
  trafficData: z.string().min(1, "Traffic data is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function RouteOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestRouteOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: "123 Main St, Anytown, USA",
      destination: "789 Oak Ave, Sometown, USA",
      trafficData: "Heavy congestion on I-95, moderate traffic on Route 1, accident near Elm Street.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await suggestRoute(data);
      setResult(suggestion);
    } catch (error) {
      console.error("Failed to get route suggestion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate a route. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="shadow-sm lg:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Sparkles className="text-primary" /> Route AI
              </CardTitle>
              <CardDescription>
                Enter details to get an AI-optimized route.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Warehouse A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 456 Tech Park" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trafficData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Real-time Traffic Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe current traffic conditions..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Generate Route"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="shadow-sm lg:col-span-2 sticky top-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Suggested Route
          </CardTitle>
          <CardDescription>
            Your AI-optimized route will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[450px] flex flex-col items-center justify-center p-0">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p>Optimizing route...</p>
            </div>
          ) : result ? (
            <div className="w-full h-full flex flex-col">
              <div className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden">
                <Image src="https://placehold.co/800x450.png" alt="Map of the suggested route" layout="fill" objectFit="cover" data-ai-hint="route map" />
                <div className="absolute top-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CornerUpLeft className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm">Origin</h3>
                      <p className="text-muted-foreground text-xs">{form.getValues('currentLocation')}</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-3 text-right">
                     <div>
                      <h3 className="font-semibold text-sm">Destination</h3>
                      <p className="text-muted-foreground text-xs">{form.getValues('destination')}</p>
                    </div>
                    <CornerUpRight className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary"/>
                        <div>
                            <h3 className="font-semibold">Est. Travel Time</h3>
                            <p className="text-muted-foreground">{result.estimatedTravelTime}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-primary mt-0.5"/>
                        <div>
                            <h3 className="font-semibold">Reasoning</h3>
                            <p className="text-muted-foreground">{result.reasoning}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                 <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/>Turn-by-turn Directions</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{result.optimizedRoute}</p>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
                <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700"/>
                <p>Submit the form to generate your route.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
