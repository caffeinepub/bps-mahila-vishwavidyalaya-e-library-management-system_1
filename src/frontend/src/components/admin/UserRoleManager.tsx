import { useGetAllUserProfiles, useAssignLibraryRole } from '../../hooks/useQueries';
import { LibraryRole } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2 } from 'lucide-react';

export default function UserRoleManager() {
  const { data: userProfiles, isLoading } = useGetAllUserProfiles();
  const assignRole = useAssignLibraryRole();

  const getRoleBadgeVariant = (role: LibraryRole): 'default' | 'secondary' | 'outline' => {
    switch (role) {
      case LibraryRole.Admin:
        return 'default';
      case LibraryRole.ResearchScholar:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: LibraryRole): string => {
    switch (role) {
      case LibraryRole.Admin:
        return 'Admin';
      case LibraryRole.ResearchScholar:
        return 'Research Scholar';
      case LibraryRole.GeneralStudent:
        return 'General Student';
      default:
        return role;
    }
  };

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
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
        <CardDescription>View and manage user roles</CardDescription>
      </CardHeader>
      <CardContent>
        {!userProfiles || userProfiles.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users found</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Principal ID</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProfiles.map(([principal, profile]) => (
                  <TableRow key={principal.toString()}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {principal.toString().slice(0, 10)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(profile.libraryRole)}>
                        {getRoleLabel(profile.libraryRole)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={profile.libraryRole}
                        onValueChange={(value) =>
                          assignRole.mutate({ user: principal, role: value as LibraryRole })
                        }
                        disabled={assignRole.isPending}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LibraryRole.GeneralStudent}>General Student</SelectItem>
                          <SelectItem value={LibraryRole.ResearchScholar}>Research Scholar</SelectItem>
                          <SelectItem value={LibraryRole.Admin}>Admin</SelectItem>
                        </SelectContent>
                      </Select>
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
