
'use server';
/**
 * @fileOverview An AI agent that analyzes financial data.
 *
 * - explainFinancials - Translates natural language queries into SQL and provides insights.
 * - ExplainFinancialsInput - Input schema.
 * - ExplainFinancialsOutput - Output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ExplainFinancialsInputSchema = z.string().describe('A natural language question about financial data.');
export type ExplainFinancialsInput = z.infer<typeof ExplainFinancialsInputSchema>;

export const ExplainFinancialsOutputSchema = z.object({
  summary: z.string().describe('A concise, one-sentence summary of the findings.'),
  recommendations: z.array(z.string()).describe('A list of 1-2 recommended actions based on the findings.'),
  sql: z.string().describe('The exact SQLite query used to generate the data.'),
  data: z.array(z.any()).describe('The raw data results from the query, formatted as a JSON array.'),
  chartHint: z.object({
    type: z.enum(['bar', 'line', 'pie']).describe('The suggested chart type.'),
    x: z.string().describe('The key to use for the X-axis or labels.'),
    y: z.union([z.string(), z.array(z.string())]).describe('The key(s) to use for the Y-axis or values.'),
  }).describe('A hint for the UI on how to best visualize the data.'),
});
export type ExplainFinancialsOutput = z.infer<typeof ExplainFinancialsOutputSchema>;


export async function explainFinancials(input: ExplainFinancialsInput): Promise<ExplainFinancialsOutput> {
  return explainFinancialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainFinancialsPrompt',
  input: {schema: ExplainFinancialsInputSchema},
  output: {schema: ExplainFinancialsOutputSchema},
  prompt: `You are a world-class financial analyst specializing in Tally data. Your task is to answer natural language questions by querying a local SQLite mirror of Tally data and providing actionable insights.

The available tables are:
- ledgers (id, name, type, open_balance)
- vouchers (id, date, voucher_type, narration, total_amount)
- voucher_lines (id, voucher_id, ledger_id, amount, is_debit)
- stock_items (id, name, quantity, rate)
- users (id, role)

User's Question: "{{{prompt}}}"

Follow these steps:
1.  **Translate to SQL:** Convert the user's question into an efficient SQLite query.
2.  **Generate Mock Data:** Based on the SQL, create realistic-looking mock JSON data that would be the result of that query.
3.  **Create Chart Hint:** Based on the query and data, provide a 'chartHint' to suggest the best visualization (bar, line, or pie).
4.  **Summarize Findings:** Write a one-sentence summary of the key insight from the data.
5.  **Recommend Actions:** Provide 1-2 concrete, actionable recommendations. For example, "Clear these top 3 overdue invoices first to boost cashflow."

**CRITICAL:** Always return the SQL query, the JSON data, the chart hint, the summary, and the recommendations in the specified JSON output format.
`,
});

const explainFinancialsFlow = ai.defineFlow(
  {
    name: 'explainFinancialsFlow',
    inputSchema: ExplainFinancialsInputSchema,
    outputSchema: ExplainFinancialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
