export interface UserProfile {
    displayName: string;
    avatar?:string|null;
    // Coordonnées affichées sur la carte d'identité du profil, quand elles sont renseignées.
    email?: string;
    phone?: string;
    department?: string;
    jobTitle?: string;
    registrationNumber?: string;
    version: number;
    clearance: string;
    organizations: string[];
    sessionExpiresAt: string;
}
