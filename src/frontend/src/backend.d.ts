import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Attendance {
    user: User;
    percentage: bigint;
}
export interface User {
    id: Id;
    userRole: Role;
    subjects: Array<string>;
    name: string;
    email: string;
    attendance: Attendance__1;
    phone: bigint;
    photo: ExternalBlob;
    parentOf?: Id;
}
export interface Material {
    id: Id;
    url: string;
    title: string;
    subject: string;
    file: ExternalBlob;
    description: string;
    author: User;
    materialType: MaterialType;
    uploadedAt: Time;
}
export interface Attendance__1 {
    present: bigint;
    late: bigint;
    absent: bigint;
}
export interface Id {
    creator: Principal;
    number: bigint;
}
export interface UserProfile {
    subjects: Array<string>;
    appRole: Role;
    name: string;
    role: UserRole;
    email: string;
    phone: bigint;
    parentOf?: Id;
}
export enum MaterialType {
    pdf = "pdf",
    link = "link",
    note = "note"
}
export enum Role {
    admin = "admin",
    teacher = "teacher",
    student = "student",
    parent = "parent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMaterial(material: Material): Promise<Material>;
    getAllAttendances(): Promise<Array<Attendance>>;
    getAllMaterials(): Promise<Array<Material>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyAttendance(): Promise<Attendance | null>;
    getStudentAttendance(studentId: Id): Promise<Attendance | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(studentId: Id, status: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
