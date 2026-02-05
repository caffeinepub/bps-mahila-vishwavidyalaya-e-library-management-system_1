import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateTimeSlots } from '../../utils/timeSlots';
import { Label } from '@/components/ui/label';

interface DateAndSlotPickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSlot: { startHour: number; endHour: number } | null;
  onSlotChange: (slot: { startHour: number; endHour: number } | null) => void;
  schedule: bigint[];
}

export default function DateAndSlotPicker({
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotChange,
  schedule,
}: DateAndSlotPickerProps) {
  const openHour = schedule.length > 0 ? Number(schedule[0]) : 8;
  const closeHour = schedule.length > 0 ? Number(schedule[schedule.length - 1]) + 1 : 20;
  const timeSlots = generateTimeSlots(openHour, closeHour);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          disabled={(date) => date < today}
          className="rounded-md border"
        />
      </div>
      <div className="space-y-2">
        <Label>Select Time Slot (2 hours)</Label>
        <Select
          value={selectedSlot ? `${selectedSlot.startHour}-${selectedSlot.endHour}` : ''}
          onValueChange={(value) => {
            const [start, end] = value.split('-').map(Number);
            onSlotChange({ startHour: start, endHour: end });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={`${slot.startHour}-${slot.endHour}`} value={`${slot.startHour}-${slot.endHour}`}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedDate && selectedSlot && (
          <p className="text-sm text-muted-foreground mt-4">
            You've selected {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} from{' '}
            {timeSlots.find((s) => s.startHour === selectedSlot.startHour)?.label}
          </p>
        )}
      </div>
    </div>
  );
}
