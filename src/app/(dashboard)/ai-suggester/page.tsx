'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { suggestMeetingTimes, SuggestMeetingTimesOutput, explainSuggestedTimes } from '@/ai/flows/ai-suggested-booking-times';
import { Loader2, Wand2, Sparkles, Lightbulb } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const formSchema = z.object({
  teamAvailability: z.string().min(10, {
    message: 'Please describe your team\'s availability in more detail.',
  }),
  meetingDuration: z.coerce.number().min(15, { message: 'Meeting must be at least 15 minutes.' }),
  preferredDays: z.string().min(1, { message: 'Please select preferred days.'}),
  preferredTimeOfDay: z.string().min(1, { message: 'Please select a preferred time.'}),
});

export default function AiSuggesterPage() {
  const [suggestions, setSuggestions] = useState<SuggestMeetingTimesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamAvailability: 'Alice is free on Monday mornings. Bob is available on Monday and Wednesday afternoons. Charlie has meetings on Wednesday from 10am to 11am.',
      meetingDuration: 60,
      preferredDays: "Monday, Wednesday",
      preferredTimeOfDay: "Afternoon"
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await suggestMeetingTimes(values);
      setSuggestions(result);
    } catch (e) {
      setError('Failed to get suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Wand2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">AI Time Suggester</h1>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Find the Perfect Time</CardTitle>
            <CardDescription>
              Let our AI analyze your team's schedule and preferences to find the best meeting slots.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="teamAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Availability</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Alice is free on Monday mornings, Bob is available on Wednesday afternoons..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your team's constraints and availability.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="meetingDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Days</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Any">Any Day</SelectItem>
                            <SelectItem value="Monday, Tuesday, Wednesday, Thursday, Friday">Weekdays</SelectItem>
                            <SelectItem value="Monday, Wednesday">Monday, Wednesday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                    control={form.control}
                    name="preferredTimeOfDay"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Preferred Time of Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a time of day" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Any">Any Time</SelectItem>
                            <SelectItem value="Morning">Morning (9am - 12pm)</SelectItem>
                            <SelectItem value="Afternoon">Afternoon (1pm - 5pm)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get Suggestions</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><Lightbulb className="w-6 h-6 text-amber-500" /> Suggestions</h2>
          {isLoading && (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center flex-col gap-4 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Our AI is thinking...</p>
                    </div>
                </CardContent>
            </Card>
          )}

          {error && <Card><CardContent className="pt-6 text-destructive">{error}</CardContent></Card>}

          {suggestions && (
             <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>Top Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suggestions.suggestedTimes.map((time, index) => (
                        <Card key={index} className="bg-background">
                            <CardHeader>
                                <CardTitle className="text-lg">{format(parseISO(time), 'EEEE, MMMM d')}</CardTitle>
                                <CardDescription>{format(parseISO(time), 'p')}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button className="w-full">Book this slot</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
                   <h3 className="font-semibold">Reasoning</h3>
                   <p className="text-sm text-muted-foreground">{suggestions.reasoning}</p>
                </CardFooter>
             </Card>
          )}
          
          {!suggestions && !isLoading && !error && (
            <Card className="flex items-center justify-center h-64 border-dashed">
              <div className="text-center text-muted-foreground">
                <p>Your smart suggestions will appear here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
