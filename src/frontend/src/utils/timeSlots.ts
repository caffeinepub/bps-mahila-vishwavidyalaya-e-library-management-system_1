export interface TimeSlot {
  startHour: number;
  endHour: number;
  label: string;
}

export function generateTimeSlots(openHour: number, closeHour: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = openHour; hour < closeHour - 1; hour += 2) {
    const endHour = Math.min(hour + 2, closeHour);
    slots.push({
      startHour: hour,
      endHour,
      label: `${formatHour(hour)} - ${formatHour(endHour)}`,
    });
  }
  
  return slots;
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

export function dateToNanoseconds(date: Date, hour: number): bigint {
  const dateAtHour = new Date(date);
  dateAtHour.setHours(hour, 0, 0, 0);
  return BigInt(dateAtHour.getTime()) * BigInt(1_000_000);
}

export function nanosecondsToDate(nanos: bigint): Date {
  return new Date(Number(nanos / BigInt(1_000_000)));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatTime(nanos: bigint): string {
  const date = nanosecondsToDate(nanos);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
