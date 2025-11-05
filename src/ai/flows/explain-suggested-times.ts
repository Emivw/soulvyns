'use server';
/**
 * @fileOverview Explains the reasoning behind suggested meeting times.
 *
 * - explainSuggestedTimes - A function that explains suggested meeting times.
 * - ExplainSuggestedTimesInput - The input type for the explainSuggestedTimes function.
 * - ExplainSuggestedTimesOutput - The return type for the explainSuggestedTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSuggestedTimesInputSchema = z.object({
  teamAvailability: z.string().describe('A summary of the team availability.'),
  userPreferences: z.string().describe('A summary of user preferences.'),
  suggestedTimes: z.string().describe('A list of suggested meeting times.'),
});
export type ExplainSuggestedTimesInput = z.infer<
  typeof ExplainSuggestedTimesInputSchema
>;

const ExplainSuggestedTimesOutputSchema = z.object({
  explanation: z.string().describe('The explanation of why the times were suggested.'),
});
export type ExplainSuggestedTimesOutput = z.infer<
  typeof ExplainSuggestedTimesOutputSchema
>;

export async function explainSuggestedTimes(
  input: ExplainSuggestedTimesInput
): Promise<ExplainSuggestedTimesOutput> {
  return explainSuggestedTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSuggestedTimesPrompt',
  input: {schema: ExplainSuggestedTimesInputSchema},
  output: {schema: ExplainSuggestedTimesOutputSchema},
  prompt: `You are an AI assistant helping to explain suggested meeting times.

  Given the following information, explain why the times were suggested.

  Team Availability: {{{teamAvailability}}}
  User Preferences: {{{userPreferences}}}
  Suggested Times: {{{suggestedTimes}}}

  Explanation:`, // Output should start with 'Explanation:' and describe reasoning.
});

const explainSuggestedTimesFlow = ai.defineFlow(
  {
    name: 'explainSuggestedTimesFlow',
    inputSchema: ExplainSuggestedTimesInputSchema,
    outputSchema: ExplainSuggestedTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
