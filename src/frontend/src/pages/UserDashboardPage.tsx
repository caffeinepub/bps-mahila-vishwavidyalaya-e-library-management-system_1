import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useCallerContext';
import { useGetMyBooking, useGetLibrarySchedule } from '../hooks/useQueries';
import ActiveBookingCard from '../components/booking/ActiveBookingCard';
import DateAndSlotPicker from '../components/booking/DateAndSlotPicker';
import SeatGrid from '../components/booking/SeatGrid';
import SeatLegend from '../components/booking/SeatLegend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen } from 'lucide-react';

export default function UserDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: myBooking } = useGetMyBooking();
  const { data: schedule } = useGetLibrarySchedule();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ startHour: number; endHour: number } | null>(null);

  const hasActiveBooking = !!myBooking;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">
          Book your seat and manage your library reservations
        </p>
      </div>

      {hasActiveBooking && (
        <ActiveBookingCard booking={myBooking} />
      )}

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="book" className="gap-2">
            <Calendar className="w-4 h-4" />
            Book a Seat
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6 mt-6">
          {!hasActiveBooking ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>Choose your preferred date and 2-hour time slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <DateAndSlotPicker
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    selectedSlot={selectedSlot}
                    onSlotChange={setSelectedSlot}
                    schedule={schedule || []}
                  />
                </CardContent>
              </Card>

              {selectedDate && selectedSlot && (
                <>
                  <SeatLegend userRole={userProfile?.libraryRole} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Seats</CardTitle>
                      <CardDescription>Select an available seat to complete your booking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SeatGrid
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        userRole={userProfile?.libraryRole}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You already have an active booking. Please cancel it before making a new reservation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Operating Hours</h3>
                <p className="text-muted-foreground">
                  {schedule && schedule.length > 0
                    ? `${Number(schedule[0])}:00 - ${Number(schedule[schedule.length - 1]) + 1}:00`
                    : 'Loading...'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Booking Rules</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Each booking is for exactly 2 hours</li>
                  <li>You can have only one active booking at a time</li>
                  <li>Cancel your booking if you cannot attend</li>
                  <li>Reserved seats are for Research Scholars only</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Your Role</h3>
                <p className="text-muted-foreground">
                  {userProfile?.libraryRole === 'ResearchScholar' && 'Research Scholar - You can book any available seat'}
                  {userProfile?.libraryRole === 'GeneralStudent' && 'General Student - You can book general seats'}
                  {userProfile?.libraryRole === 'Admin' && 'Administrator - You have full access'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
