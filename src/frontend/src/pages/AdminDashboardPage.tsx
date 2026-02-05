import { useIsCallerAdmin } from '../hooks/useCallerContext';
import AccessDeniedScreen from '../components/common/AccessDeniedScreen';
import UserRoleManager from '../components/admin/UserRoleManager';
import BookingsTable from '../components/admin/BookingsTable';
import LibraryHoursPanel from '../components/admin/LibraryHoursPanel';
import SeatConfigurationPanel from '../components/admin/SeatConfigurationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, bookings, and library configuration
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="bookings" className="gap-2">
            <Calendar className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserRoleManager />
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <BookingsTable />
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-6">
          <LibraryHoursPanel />
          <SeatConfigurationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
