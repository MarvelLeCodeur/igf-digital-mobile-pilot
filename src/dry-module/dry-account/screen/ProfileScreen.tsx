import type { ReactNode } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import type { UserProfile } from '../../dry-user/model/dry-user.interface';
import { Action } from '../../../shared/component/Action';
import { styles } from './ProfileScreen.styles';

interface ProfileProps {
    profile:UserProfile;
    displayName:string;
    busy:boolean;
    setDisplayName:(value:string) => void;
    saveProfile:() => Promise<void>;
    shortcuts:ReactNode;
}

export function ProfileScreen({ profile,displayName,busy,setDisplayName,saveProfile,shortcuts }: ProfileProps) {
    const initials = profile.displayName.trim().split(/\s+/).slice(0,2).map(part=>part[0]?.toUpperCase()).join('');
    return (
        <>
            <View style={styles.identity}>
                {profile.avatar ? <Image source={{uri:profile.avatar}} style={styles.avatar} accessibilityLabel="Photo de profil" /> :
                    <View style={styles.avatar}><Text style={styles.initials}>{initials || 'IGF'}</Text></View>}
                <Text style={styles.identityName}>{profile.displayName}</Text>
                <Text style={styles.identityRole}>Pilotage · IGF</Text>
            </View>
            {shortcuts}
            <View style={styles.card}>
                <Text style={styles.status}>IDENTITÉ AFFICHÉE</Text>
                <Text style={styles.label}>Nom d’affichage</Text>
                <TextInput style={styles.input} accessibilityLabel="Nom d’affichage" value={displayName}
                    onChangeText={setDisplayName} maxLength={80} autoComplete="name" />
                <Action label="Enregistrer" disabled={busy || displayName.trim() === profile.displayName || displayName.trim().length < 2}
                    onPress={() => void saveProfile()} />
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>Accès et session</Text>
                <Text style={styles.text}>Niveau d’accès · {profile.clearance}</Text>
                <Text style={styles.text}>Organisations · {profile.organizations.join(', ') || 'Aucune'}</Text>
                <Text style={styles.text}>Expiration · {new Date(profile.sessionExpiresAt).toLocaleString('fr-FR')}</Text>
            </View>
        </>
    );
}
