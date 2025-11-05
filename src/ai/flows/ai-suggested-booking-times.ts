'use server';
/**
 * @fileOverview AI-powered meeting time suggestion flow.
 *
 * - suggestMeetingTimes - A function that suggests optimal meeting times based on team availability and preferences.
 * - SuggestMeetingTimesInput - The input type for the suggestMeetingTimes function.
 * - SuggestMeetingTimesOutput - The return type for the suggestMeetingTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMeetingTimesInputSchema = z.object({
  teamAvailability: z
    .string()
    .describe('A summary of the team availability, including existing meetings and commitments.'),
  meetingDuration: z.number().describe('The duration of the meeting in minutes.'),
  preferredDays: z.string().describe('The preferred days of the week for the meeting.'),
  preferredTimeOfDay: z.string().describe('The preferred time of day for the meeting (e.g., morning, afternoon).'),
});
export type SuggestMeetingTimesInput = z.infer<typeof SuggestMeetingTimesInputSchema>;

const SuggestMeetingTimesOutputSchema = z.object({
  suggestedTimes: z
    .array(z.string())
    .describe('A list of suggested meeting times in ISO 8601 format.'),
  reasoning: z.string().describe('The AI’s reasoning for suggesting these times.'),
});
export type SuggestMeetingTimesOutput = z.infer<typeof SuggestMeetingTimesOutputSchema>;

export async function suggestMeetingTimes(input: SuggestMeetingTimesInput): Promise<SuggestMeetingTimesOutput> {
  return suggestMeetingTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMeetingTimesPrompt',
  input: {schema: SuggestMeetingTimesInputSchema},
  output: {schema: SuggestMeetingTimesOutputSchema},
  prompt: `You are an AI assistant that suggests optimal meeting times for a team.

  Consider the following information when suggesting times:

  Team Availability: {{{teamAvailability}}}
  Meeting Duration: {{{meetingDuration}}} minutes
  Preferred Days: {{{preferredDays}}}
  Preferred Time of Day: {{{preferredTimeOfDay}}}

  Suggest at least three meeting times, and explain your reasoning for choosing those times. Return the suggested times in ISO 8601 format.`,
});

const suggestMeetingTimesFlow = ai.defineFlow(
  {
    name: 'suggestMeetingTimesFlow',
    inputSchema: SuggestMeetingTimesInputSchema,
    outputSchema: SuggestMeetingTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
