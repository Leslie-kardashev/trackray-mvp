
'use server';
/**
 * @fileOverview A fuel consumption calculation AI agent for drivers.
 *
 * - calculateFuel - A function that estimates fuel consumption for a trip.
 * - CalculateFuelInput - The input type for the calculateFuel function.
 * - CalculateFuelOutput - The return type for the calculateFuel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateFuelInputSchema = z.object({
  distance: z.string().describe('The total distance of the trip, e.g., "150 km".'),
  vehicleType: z.string().describe('The type of vehicle, e.g., "Standard Cargo Van", "Motorbike", "Heavy Duty Truck".'),
});
export type CalculateFuelInput = z.infer<typeof CalculateFuelInputSchema>;

const CalculateFuelOutputSchema = z.object({
  fuelConsumedLiters: z.number().describe('The estimated fuel consumption in liters.'),
  estimatedCost: z.string().describe('The estimated cost of the fuel in Ghana Cedis (GHS), formatted as "GHS XXX.XX".'),
  reasoning: z.string().describe('A brief explanation of the assumptions made for the calculation, like average fuel efficiency and price.'),
});
export type CalculateFuelOutput = z.infer<typeof CalculateFuelOutputSchema>;

export async function calculateFuel(input: CalculateFuelInput): Promise<CalculateFuelOutput> {
  return calculateFuelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateFuelPrompt',
  input: {schema: CalculateFuelInputSchema},
  output: {schema: CalculateFuelOutputSchema},
  prompt: `You are a logistics and fuel efficiency expert for Ghana. Your task is to calculate the estimated fuel consumption for a trip.

Use the following information:
- Trip Distance: {{{distance}}}
- Vehicle Type: {{{vehicleType}}}

Assumptions to make:
- Use a reasonable average fuel efficiency (km/L) for the given vehicle type in a Ghanaian context. For example, a standard cargo van might get 8 km/L, a motorbike 35 km/L, and a heavy-duty truck 4 km/L.
- Use an average current fuel price in Ghana. Assume a price of GHS 14.50 per liter.
- Calculate the total liters of fuel needed.
- Calculate the total estimated cost in Ghana Cedis (GHS).
- Provide a brief reasoning for your calculation, mentioning the assumed fuel efficiency and price.

Return the result in the specified JSON format.`,
});

const calculateFuelFlow = ai.defineFlow(
  {
    name: 'calculateFuelFlow',
    inputSchema: CalculateFuelInputSchema,
    outputSchema: CalculateFuelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
