'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, set } from 'date-fns';
import { Clock } from 'lucide-react';

const generateTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    const slots = [];
    for (let i = 9; i <= 17; i++) {
      if (Math.random() > 0.3) { // Simulate some slots being unavailable
        slots.push(set(date, { hours: i, minutes: 0, seconds: 0, milliseconds: 0 }));
      }
      if (i < 17 && Math.random() > 0.5) {
        slots.push(set(date, { hours: i, minutes: 30, seconds: 0, milliseconds: 0 }));
      }
    }
    return slots;
};


export default function BookingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();

  const timeSlots = generateTimeSlots(date);

  const handleBooking = () => {
    if (!selectedSlot) return;
    
    setIsConfirming(true);
    setTimeout(() => {
        setIsConfirming(false);
        setSelectedSlot(null);
        document.getElementById('close-dialog')?.click();
        toast({
            title: "Booking Confirmed!",
            description: `Your meeting on ${format(selectedSlot, 'PPPp')} is booked.`,
        });
    }, 1500)
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Bookings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
          <CardDescription>
            Select a date to see available time slots and make a booking.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Available Slots for {date ? format(date, 'PPP') : '...'}
            </h3>
            {timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <Dialog>
                    {timeSlots.map((slot) => (
                    <DialogTrigger asChild key={slot.toISOString()}>
                        <Button variant="outline" onClick={() => setSelectedSlot(slot)}>
                            <Clock className="mr-2 h-4 w-4" />
                            {format(slot, 'p')}
                        </Button>
                    </DialogTrigger>
                    ))}
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Confirm Your Booking</DialogTitle>
                        <DialogDescription>
                            You are about to book a meeting for{' '}
                            <strong>{selectedSlot ? format(selectedSlot, 'PPPp') : ''}</strong>.
                        </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" id="close-dialog">Cancel</Button>
                            <Button onClick={handleBooking} disabled={isConfirming}>
                                {isConfirming ? 'Confirming...' : 'Confirm Booking'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            ) : (
                <p className="text-muted-foreground">No available slots for this day.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
