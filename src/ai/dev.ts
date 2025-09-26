
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-route.ts';
import '@/ai/flows/calculate-fuel.ts';
import '@/ai/flows/propose-voucher-correction.ts';
import '@/ai/flows/explain-financials.ts';
