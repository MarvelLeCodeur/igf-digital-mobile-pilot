import { useState } from 'react';
import type { UserProfile } from '../../dry-user/model/dry-user.interface';
import { accountService } from '../service/account.service';

interface ProfileState {
    session:boolean;
    busy:boolean;
    setBusy:(value:boolean) => void;
    setError:(value:string) => void;
    setFeedback:(value:string) => void;

}

export function useProfileScreen({ session,busy,setBusy,setError,setFeedback }: ProfileState) {
    const [profile, setProfile] = useState<UserProfile|null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [displayName, setDisplayName] = useState('');

    function resetProfile() {
        setProfile(null);
        setProfileOpen(false);
        setDisplayName('');
    }

    async function openProfile() {
        if (!session || busy) return;
        setBusy(true);
        setError('');
        setFeedback('');
        try {
            const {data} = await accountService.getProfile();
            setProfile(data);
            setDisplayName(data.displayName);
            setProfileOpen(true);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Profil indisponible.');
        } finally { setBusy(false); }
    }

    // Enregistre le nom et, si fournie, la photo (null la retire, undefined la laisse inchangée).
    // Renvoie true quand l'enregistrement a réussi, pour que l'écran referme l'éditeur.
    async function saveProfile(avatar?:string | null):Promise<boolean> {
        if (!session || !profile || busy || displayName.trim().length < 2) return false;
        setBusy(true);
        setError('');
        setFeedback('');
        try {
            const {data} = await accountService.updateProfile({
                expectedVersion:profile.version, displayName:displayName.trim(), avatar,
            });
            setProfile(data);
            setDisplayName(data.displayName);
            setFeedback('Profil enregistré.');
            return true;
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Profil indisponible.');
            return false;
        } finally { setBusy(false); }
    }

    function closeProfile() {
        setProfileOpen(false);
        setFeedback('');
        setError('');
    }

    return { profile,profileOpen,displayName,setDisplayName,openProfile,saveProfile,closeProfile,resetProfile };
}
