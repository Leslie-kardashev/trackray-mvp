
'use server';
/**
 * @fileOverview An AI agent that proposes Tally voucher corrections.
 *
 * - proposeVoucherCorrection - Generates Tally XML to correct a voucher.
 * - ProposeVoucherCorrectionInput - Input schema.
 * - ProposeVoucherCorrectionOutput - Output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ProposeVoucherCorrectionInputSchema = z.object({
  voucherId: z.string().describe('The master ID of the voucher to be altered, e.g., "VCH-00453".'),
  currentNarration: z.string().describe('The current narration of the voucher.'),
  currentAmount: z.string().describe('The current total amount of the voucher.'),
  requestedChange: z.string().describe('The user\'s request in plain English for the correction.'),
});
export type ProposeVoucherCorrectionInput = z.infer<typeof ProposeVoucherCorrectionInputSchema>;

export const ProposeVoucherCorrectionOutputSchema = z.object({
  tallyXml: z.string().describe('The complete Tally XML <ENVELOPE> required to import the altered voucher.'),
});
export type ProposeVoucherCorrectionOutput = z.infer<typeof ProposeVoucherCorrectionOutputSchema>;

export async function proposeVoucherCorrection(input: ProposeVoucherCorrectionInput): Promise<ProposeVoucherCorrectionOutput> {
  return proposeVoucherCorrectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proposeVoucherCorrectionPrompt',
  input: {schema: ProposeVoucherCorrectionInputSchema},
  output: {schema: ProposeVoucherCorrectionOutputSchema},
  prompt: `You are an expert in Tally Prime's XML import format. Your task is to generate the precise XML needed to alter an existing voucher.

The user wants to modify a voucher with the following details:
- Voucher Master ID: {{{voucherId}}}
- Current Narration: "{{{currentNarration}}}"
- Current Amount: {{{currentAmount}}}

The user has requested the following change:
"{{{requestedChange}}}"

Based on the request, generate a complete Tally XML <ENVELOPE> block.
- Use the <VOUCHER> tag with ACTION="Alter".
- The <MASTERID> tag inside the VOUCHER must match the provided voucherId.
- If the user wants to change the narration, update the <NARRATION> tag.
- If the user wants to change the amount, update the <VOUCHER> amount and the corresponding ledger entries in <ALLLEDGERENTRIES.LIST>. Assume a simple two-leg transaction (one debit, one credit) and adjust both legs to match the new total amount. Keep the original ledger names unless specified.
- The XML must be well-formed and ready for Tally's import function.
- Do not include any explanations, just the raw XML.

Example for changing narration:
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>All Masters</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER ACTION="Alter">
            <MASTERID>{{{voucherId}}}</MASTERID>
            <NARRATION>The new narration from user request</NARRATION>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>

Example for changing amount:
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>All Masters</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER ACTION="Alter">
            <MASTERID>{{{voucherId}}}</MASTERID>
            <ALLLEDGERENTRIES.LIST>
                <LEDGERNAME>Ledger A</LEDGERNAME>
                <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
                <AMOUNT>New Amount</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
                <LEDGERNAME>Ledger B</LEDGERNAME>
                <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
                <AMOUNT>-New Amount</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>

Generate the XML for the user's request.
`,
});

const proposeVoucherCorrectionFlow = ai.defineFlow(
  {
    name: 'proposeVoucherCorrectionFlow',
    inputSchema: ProposeVoucherCorrectionInputSchema,
    outputSchema: ProposeVoucherCorrectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
