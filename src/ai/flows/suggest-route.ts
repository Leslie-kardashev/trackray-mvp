// src/ai/flows/suggest-route.ts
'use server';
/**
 * @fileOverview A route suggestion AI agent for drivers.
 *
 * - suggestRoute - A function that suggests an optimized route based on traffic data.
 * - SuggestRouteInput - The input type for the suggestRoute function.
 * - SuggestRouteOutput - The return type for the suggestRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRouteInputSchema = z.object({
  currentLocation: z.string().describe('The driver\'s current location.'),
  destination: z.string().describe('The delivery destination.'),
  trafficData: z.string().describe('Real-time traffic data for the area.'),
});
export type SuggestRouteInput = z.infer<typeof SuggestRouteInputSchema>;

const SuggestRouteOutputSchema = z.object({
  optimizedRoute: z.string().describe('The suggested optimized route with turn-by-turn directions.'),
  estimatedTravelTime: z.string().describe('The estimated travel time for the suggested route.'),
  reasoning: z.string().describe('Explanation of why the route is optimal based on traffic conditions.'),
});
export type SuggestRouteOutput = z.infer<typeof SuggestRouteOutputSchema>;

export async function suggestRoute(input: SuggestRouteInput): Promise<SuggestRouteOutput> {
  return suggestRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRoutePrompt',
  input: {schema: SuggestRouteInputSchema},
  output: {schema: SuggestRouteOutputSchema},
  prompt: `You are an AI route optimization expert for delivery drivers in Ghana. Based on the driver's current location, destination, and real-time traffic data, suggest the most optimized route.

Current Location: {{{currentLocation}}}
Destination: {{{destination}}}
Traffic Data: {{{trafficData}}}

Provide turn-by-turn directions, estimated travel time, and explain why the suggested route is optimal based on the current traffic conditions. Ensure the total distance in kilometers is mentioned in the turn-by-turn directions.`,
});

const suggestRouteFlow = ai.defineFlow(
  {
    name: 'suggestRouteFlow',
    inputSchema: SuggestRouteInputSchema,
    outputSchema: SuggestRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
