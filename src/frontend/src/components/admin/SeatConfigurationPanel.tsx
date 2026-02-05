import { useGetSeatConfiguration } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Loader2 } from 'lucide-react';

export default function SeatConfigurationPanel() {
  const { data: config, isLoading } = useGetSeatConfiguration();

  if (isLoading) {
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
          <Monitor className="w-5 h-5" />
          Seat Configuration
        </CardTitle>
        <CardDescription>Current library seat allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Seats</p>
            <p className="text-3xl font-bold text-foreground">{config ? Number(config.totalSeats) : 0}</p>
          </div>
          <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Reserved Seats</p>
            <p className="text-3xl font-bold text-foreground">{config ? Number(config.reservedSeats) : 0}</p>
            <p className="text-xs text-muted-foreground mt-1">For Research Scholars</p>
          </div>
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">General Seats</p>
            <p className="text-3xl font-bold text-foreground">{config ? Number(config.generalSeats) : 0}</p>
            <p className="text-xs text-muted-foreground mt-1">For All Students</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
