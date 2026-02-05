import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, LibraryRole, Booking, SeatType } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUserProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAssignLibraryRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: LibraryRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignLibraryRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUserProfiles'] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role');
    },
  });
}

export function useGetLibrarySchedule() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['librarySchedule'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLibrarySchedule();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetLibraryHours() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ openHour, closeHour }: { openHour: bigint; closeHour: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setLibraryHours(openHour, closeHour);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['librarySchedule'] });
      toast.success('Library hours updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update library hours');
    },
  });
}

export function useGetAvailableSeats(startTime: bigint | null, endTime: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, SeatType]>>({
    queryKey: ['availableSeats', startTime?.toString(), endTime?.toString()],
    queryFn: async () => {
      if (!actor || startTime === null || endTime === null) return [];
      return actor.getAvailableSeats(startTime, endTime);
    },
    enabled: !!actor && !actorFetching && startTime !== null && endTime !== null,
  });
}

export function useBookSeat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ seatId, startTime, endTime }: { seatId: bigint; startTime: bigint; endTime: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookSeat(seatId, startTime, endTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBooking'] });
      queryClient.invalidateQueries({ queryKey: ['availableSeats'] });
      toast.success('Seat booked successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to book seat');
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelBooking();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBooking'] });
      queryClient.invalidateQueries({ queryKey: ['availableSeats'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
}

export function useGetMyBooking() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking | null>({
    queryKey: ['myBooking'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyBookings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, Booking]>>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSeatConfiguration() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ totalSeats: bigint; reservedSeats: bigint; generalSeats: bigint }>({
    queryKey: ['seatConfiguration'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSeatConfiguration();
    },
    enabled: !!actor && !actorFetching,
  });
}
