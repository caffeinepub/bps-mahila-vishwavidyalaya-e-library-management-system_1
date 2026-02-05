import { useState, useEffect } from 'react';
import { useGetLibrarySchedule, useSetLibraryHours } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function LibraryHoursPanel() {
  const { data: schedule } = useGetLibrarySchedule();
  const setHours = useSetLibraryHours();

  const currentOpenHour = schedule && schedule.length > 0 ? Number(schedule[0]) : 8;
  const currentCloseHour = schedule && schedule.length > 0 ? Number(schedule[schedule.length - 1]) + 1 : 20;

  const [openHour, setOpenHour] = useState(currentOpenHour);
  const [closeHour, setCloseHour] = useState(currentCloseHour);

  useEffect(() => {
    if (schedule && schedule.length > 0) {
      setOpenHour(Number(schedule[0]));
      setCloseHour(Number(schedule[schedule.length - 1]) + 1);
    }
  }, [schedule]);

  const handleSave = () => {
    setHours.mutate({ openHour: BigInt(openHour), closeHour: BigInt(closeHour) });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Library Operating Hours
        </CardTitle>
        <CardDescription>Configure when the library is open for bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Opening Hour</Label>
            <Select value={openHour.toString()} onValueChange={(v) => setOpenHour(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h.toString()}>
                    {h}:00 {h < 12 ? 'AM' : 'PM'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Closing Hour</Label>
            <Select value={closeHour.toString()} onValueChange={(v) => setCloseHour(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h.toString()} disabled={h <= openHour}>
                    {h}:00 {h < 12 ? 'AM' : 'PM'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSave} disabled={setHours.isPending || openHour >= closeHour}>
          {setHours.isPending ? 'Saving...' : 'Save Hours'}
        </Button>
      </CardContent>
    </Card>
  );
}
