import { useGetAvailableSeats, useBookSeat } from '../../hooks/useQueries';
import { dateToNanoseconds } from '../../utils/timeSlots';
import { LibraryRole, SeatType } from '../../backend';
import { Button } from '@/components/ui/button';
import { Monitor, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SeatGridProps {
  selectedDate: Date;
  selectedSlot: { startHour: number; endHour: number };
  userRole?: LibraryRole;
}

export default function SeatGrid({ selectedDate, selectedSlot, userRole }: SeatGridProps) {
  const [selectedSeat, setSelectedSeat] = useState<bigint | null>(null);
  const startTime = dateToNanoseconds(selectedDate, selectedSlot.startHour);
  const endTime = dateToNanoseconds(selectedDate, selectedSlot.endHour);
  
  const { data: availableSeats, isLoading } = useGetAvailableSeats(startTime, endTime);
  const bookSeat = useBookSeat();

  const handleBook = () => {
    if (selectedSeat !== null) {
      bookSeat.mutate({ seatId: selectedSeat, startTime, endTime });
      setSelectedSeat(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const availableSeatsSet = new Set(availableSeats?.map(([id]) => Number(id)) || []);
  const allSeats = Array.from({ length: 120 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {allSeats.map((seatNum) => {
          const isAvailable = availableSeatsSet.has(seatNum);
          const isReserved = seatNum <= 20;
          const isSelected = selectedSeat === BigInt(seatNum);

          return (
            <button
              key={seatNum}
              onClick={() => isAvailable && setSelectedSeat(BigInt(seatNum))}
              disabled={!isAvailable || bookSeat.isPending}
              className={`
                aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all
                ${isSelected ? 'border-primary bg-primary text-primary-foreground scale-105' : ''}
                ${isAvailable && !isSelected ? 'border-border bg-card hover:border-primary hover:bg-primary/10 cursor-pointer' : ''}
                ${!isAvailable ? 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50' : ''}
              `}
            >
              <Monitor className="w-4 h-4" />
              <span>{seatNum}</span>
              {isReserved && <span className="text-[10px]">R</span>}
            </button>
          );
        })}
      </div>

      {selectedSeat !== null && (
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div>
            <p className="font-semibold text-foreground">Seat {Number(selectedSeat)} selected</p>
            <p className="text-sm text-muted-foreground">
              {Number(selectedSeat) <= 20 ? 'Reserved seat' : 'General seat'}
            </p>
          </div>
          <Button onClick={handleBook} disabled={bookSeat.isPending}>
            {bookSeat.isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      )}
    </div>
  );
}
