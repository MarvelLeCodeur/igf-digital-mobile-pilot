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

    async function saveProfile() {
        if (!session || !profile || busy || displayName.trim().length < 2) return;
        setBusy(true);
        setError('');
        setFeedback('');
        try {
            const {data} = await accountService.updateProfile({
                expectedVersion:profile.version, displayName:displayName.trim(),
            });
            setProfile(data);
            setDisplayName(data.displayName);
            setFeedback('Profil enregistré.');
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Profil indisponible.');
        } finally { setBusy(false); }
    }

    function closeProfile() {
        setProfileOpen(false);
        setFeedback('');
        setError('');
    }

    return { profile,profileOpen,displayName,setDisplayName,openProfile,saveProfile,closeProfile,resetProfile };
}
