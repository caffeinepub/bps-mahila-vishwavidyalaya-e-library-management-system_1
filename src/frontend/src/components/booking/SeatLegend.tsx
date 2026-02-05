import { LibraryRole } from '../../backend';
import { Monitor } from 'lucide-react';

interface SeatLegendProps {
  userRole?: LibraryRole;
}

export default function SeatLegend({ userRole }: SeatLegendProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-3">Seat Legend</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-border bg-card flex items-center justify-center">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Available</p>
            <p className="text-xs text-muted-foreground">Ready to book</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-border bg-muted flex items-center justify-center opacity-50">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Booked</p>
            <p className="text-xs text-muted-foreground">Not available</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-border bg-card flex items-center justify-center relative">
            <Monitor className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 text-[10px] font-bold bg-primary text-primary-foreground rounded px-1">R</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Reserved</p>
            <p className="text-xs text-muted-foreground">
              {userRole === LibraryRole.ResearchScholar || userRole === LibraryRole.Admin
                ? 'You can book these'
                : 'Research Scholars only'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
