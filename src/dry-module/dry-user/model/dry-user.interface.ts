export interface UserProfile {
    displayName: string;
    avatar?:string|null;
    version: number;
    clearance: string;
    organizations: string[];
    sessionExpiresAt: string;
}
