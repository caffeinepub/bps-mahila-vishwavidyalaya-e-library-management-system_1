import { useGetAllBookings, useGetAllUserProfiles } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatTime } from '../../utils/timeSlots';
import { Calendar, Loader2 } from 'lucide-react';

export default function BookingsTable() {
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();
  const { data: userProfiles } = useGetAllUserProfiles();

  const getUserName = (principalStr: string): string => {
    const profile = userProfiles?.find(([p]) => p.toString() === principalStr);
    return profile ? profile[1].name : principalStr.slice(0, 10) + '...';
  };

  if (bookingsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          All Bookings
        </CardTitle>
        <CardDescription>View all active seat reservations</CardDescription>
      </CardHeader>
      <CardContent>
        {!bookings || bookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No active bookings</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(([principal, booking], idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{getUserName(principal.toString())}</TableCell>
                    <TableCell>Seat {Number(booking.seatId)}</TableCell>
                    <TableCell>{formatDate(new Date(Number(booking.startTime / BigInt(1_000_000))))}</TableCell>
                    <TableCell className="text-sm">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
