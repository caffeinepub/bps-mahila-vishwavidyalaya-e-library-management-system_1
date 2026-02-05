import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    startTime: Time;
    endTime: Time;
    userId: Principal;
    seatId: bigint;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    libraryRole: LibraryRole;
}
export enum LibraryRole {
    ResearchScholar = "ResearchScholar",
    Admin = "Admin",
    GeneralStudent = "GeneralStudent"
}
export enum SeatType {
    reserved = "reserved",
    general = "general"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignLibraryRole(user: Principal, role: LibraryRole): Promise<void>;
    bookSeat(seatId: bigint, startTime: Time, endTime: Time): Promise<void>;
    bootstrapAdmin(secret: string): Promise<void>;
    cancelBooking(): Promise<void>;
    getAllBookings(): Promise<Array<[Principal, Booking]>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getAvailableSeats(startTime: Time, endTime: Time): Promise<Array<[bigint, SeatType]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLibrarySchedule(): Promise<Array<bigint>>;
    getMyBookings(): Promise<Booking | null>;
    getSeatConfiguration(): Promise<{
        reservedSeats: bigint;
        totalSeats: bigint;
        generalSeats: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setLibraryHours(openHour: bigint, closeHour: bigint): Promise<void>;
}
