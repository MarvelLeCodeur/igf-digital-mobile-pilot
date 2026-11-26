import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import type { Href } from 'expo-router';
import { FormScrollView } from '../../../shared/component/FormScrollView';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import type { IconName } from '../../../shared/component/RemixIcon';
import type { UserProfile } from '../../dry-user/model/dry-user.interface';
import { PrimaryAction } from '../../../shared/component/ScreenElements/ScreenElements';
import type { HomeTotals } from '../../../feature/home/service/home.service';
import { pickProfilePhoto } from '../service/profile-photo.service';
import { styles } from './ProfileScreen.styles';

// Raccourci du menu « Mon espace » vers une autre rubrique de Pilot.
interface ProfileLink {
    label: string;
    icon: IconName;
    href: Href;
}

interface ProfileProps {
    profile: UserProfile;
    displayName: string;
    busy: boolean;
    setDisplayName: (value: string) => void;
    saveProfile: (avatar?:string | null) => Promise<boolean>;
    // Chiffres de l'accueil réutilisés pour les statistiques (null tant qu'ils ne sont pas chargés).
    totals: HomeTotals | null;
    summaryFailed: boolean;
    reloadSummary: () => void;
    links: readonly ProfileLink[];
    onOpenLink: (href: Href) => void;
    onSignOut: () => void;
    error: string;
    feedback: string;
}

export function ProfileScreen(props: ProfileProps) {
    const { profile } = props;
    // Éditeur ouvert ou fermé, et photo en cours de choix.
    const [editing, setEditing] = useState(false);
    const [failedAvatar,setFailedAvatar] = useState<string | null>(null);
    // undefined : photo inchangée ; null : photo retirée ; objet : nouvelle photo choisie.
    const [photo,setPhoto] = useState<Awaited<ReturnType<typeof pickProfilePhoto>>>();
    const [picking,setPicking] = useState(false);
    const [photoError,setPhotoError] = useState('');
    const avatar = photo === undefined ? profile.avatar : photo?.uri;
    const changed = photo !== undefined || props.displayName.trim() !== profile.displayName;

    // Referme l'éditeur et abandonne les modifications non enregistrées.
    function closeEditor() {
        setPhoto(undefined);
        setPhotoError('');
        props.setDisplayName(profile.displayName);
        setEditing(false);
    }

    // Ouvre la photothèque ; une erreur de lecture ou de taille est affichée sous le bouton.
    async function choosePhoto() {
        if (picking || props.busy) return;
        setPhotoError('');
        setPicking(true);
        try {
            const selection = await pickProfilePhoto();
            if (selection) setPhoto(selection);
        } catch (cause) {
            setPhotoError(cause instanceof Error ? cause.message : 'Impossible d’ouvrir la photothèque.');
        } finally { setPicking(false); }
    }

    // Enregistre le nom et la photo ; l'éditeur ne se ferme que si l'enregistrement a réussi.
    async function save() {
        if (await props.saveProfile(photo === undefined ? undefined : photo?.data ?? null)) {
            setPhoto(undefined);
            setEditing(false);
        }
    }

    const initials = profile.displayName.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
    // Coordonnées : seules celles qui sont renseignées s'affichent.
    const contacts: {icon: IconName; label: string; value: string | undefined}[] = [
        {icon:'mail-line', label:'Adresse e-mail', value:profile.email},
        {icon:'phone-line', label:'Téléphone', value:profile.phone},
        {icon:'building-line', label:'Service', value:profile.department || profile.organizations.join(', ')},
    ];
    // Les mêmes indicateurs que sur l'accueil : approbations en attente, missions en cours et alertes ouvertes.
    const { totals } = props;
    const metrics = [
        { label:'À approuver', count:totals?.approvalsPending ?? null, icon:'checkbox-circle-line', color:'#0959c7', tint:'#edf4ff' },
        { label:'En cours', count:totals ? totals.statuses['EN_COURS'] ?? 0 : null, icon:'folder-3-line', color:'#986008', tint:'#fff6e6' },
        { label:'Alertes', count:totals?.totals.openRisks ?? null, icon:'alarm-warning-line', color:'#b12d3c', tint:'#fff0f2' },
    ] as const;
    return (
        <FormScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Carte d'identité : le bouton photo ouvre aussi l'éditeur. */}
            <View style={styles.identityCard}>
                <View style={styles.identity}>
                    <View style={styles.identityGlow} pointerEvents="none" accessible={false} />
                    <View style={styles.portrait}>
                        {avatar && avatar !== failedAvatar ? <Image source={{uri:avatar}} style={styles.avatar} accessibilityLabel="Photo de profil" onError={() => setFailedAvatar(avatar)} /> :
                            <View style={styles.avatar}><Text style={styles.initials}>{initials || 'IGF'}</Text></View>}
                        <Pressable accessibilityRole="button" accessibilityLabel="Choisir une photo de profil" accessibilityState={{expanded:editing,disabled:picking || props.busy}} disabled={picking || props.busy}
                            onPress={() => { setEditing(true); void choosePhoto(); }} hitSlop={6} style={({pressed}) => [styles.edit,pressed && styles.pressed]}>
                            <RemixIcon name="image-line" size={17} color="#fff" />
                        </Pressable>
                    </View>
                    <View style={styles.identityDetails}>
                        <Text accessibilityRole="header" style={styles.identityName}>{profile.displayName}</Text>
                        <View style={styles.role}>
                            <RemixIcon name="shield-check-line" size={15} color="#0758b3" />
                            <Text style={styles.identityRole}>{profile.jobTitle || 'Pilotage'} · IGF</Text>
                        </View>
                        {profile.registrationNumber ? <Text style={styles.label}>Matricule · {profile.registrationNumber}</Text> : null}
                    </View>
                </View>
                {contacts.some(contact => contact.value) ? <View style={styles.rows}>
                    {contacts.filter(contact => contact.value).map(({icon,label,value}, index) => <View key={icon}
                        style={[styles.row,index > 0 && styles.divider]}>
                        <View style={styles.contactIcon}><RemixIcon name={icon} size={17} color="#17599b" /></View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactLabel}>{label}</Text>
                            <Text selectable style={styles.rowText}>{value}</Text>
                        </View>
                    </View>)}
                </View> : null}
            </View>

            {props.error ? <Text accessibilityRole="alert" style={styles.error}>{props.error}</Text> : null}
            {props.feedback ? <Text accessibilityLiveRegion="polite" style={styles.feedback}>{props.feedback}</Text> : null}

            {/* Éditeur : photo (changer ou retirer) puis nom d'affichage. */}
            {editing ? <View style={styles.card}>
                <Text style={styles.title}>Modifier mon profil</Text>
                <View style={styles.photoActions}>
                    <Pressable accessibilityRole="button" disabled={picking || props.busy} onPress={() => void choosePhoto()} style={styles.photoButton}>
                        {picking ? <ActivityIndicator color="#075cb9" /> : <RemixIcon name="image-line" size={19} color="#075cb9" />}
                        <Text style={styles.link}>{avatar ? 'Changer la photo' : 'Ajouter une photo'}</Text>
                    </Pressable>
                    {avatar ? <Pressable accessibilityRole="button" disabled={picking || props.busy} onPress={() => { setPhoto(null); setPhotoError(''); }} style={styles.removePhoto}>
                        <Text style={styles.error}>Retirer</Text>
                    </Pressable> : null}
                </View>
                {photoError ? <Text accessibilityRole="alert" style={styles.error}>{photoError}</Text> : null}
                <Text style={styles.label}>Nom d’affichage</Text>
                <TextInput editable={!props.busy} style={styles.input} accessibilityLabel="Nom d’affichage" value={props.displayName}
                    onChangeText={props.setDisplayName} maxLength={80} autoComplete="name" />
                <PrimaryAction label="Enregistrer" disabled={props.busy || picking || !changed || props.displayName.trim().length < 2}
                    onPress={() => void save()} />
                <Pressable accessibilityRole="button" onPress={closeEditor} disabled={props.busy || picking} style={styles.cancelEdit}>
                    <Text style={styles.link}>Annuler</Text>
                </Pressable>
            </View> : null}

            {/* Statistiques : trois cartes, avec un lien pour réessayer si le chargement a échoué. */}
            <View style={styles.stats}>
                <View style={styles.heading}>
                    <Text accessibilityRole="header" style={styles.title}>Mes statistiques</Text>
                </View>
                {totals ? <View style={styles.metrics}>
                    {metrics.map(item => <View key={item.label} style={[styles.metric,{backgroundColor:item.tint}]}>
                        <View style={styles.metricIcon}><RemixIcon name={item.icon} color={item.color} size={19} /></View>
                        <Text style={styles.count}>{item.count ?? '—'}</Text>
                        <Text style={styles.metricLabel}>{item.label}</Text>
                    </View>)}
                </View> : props.summaryFailed ? <Pressable accessibilityRole="button" onPress={props.reloadSummary}>
                    <Text style={styles.link}>Réessayer le chargement de la synthèse</Text>
                </Pressable> : <Text style={styles.label}>Chargement de la synthèse…</Text>}
            </View>

            {/* Menu « Mon espace » : modification du compte, rubriques de Pilot, puis déconnexion. */}
            <View style={styles.menu}>
                <Text accessibilityRole="header" style={styles.title}>Mon espace</Text>
                <View style={styles.menuGroup}>
                    <ProfileAction icon="user-line" label="Mon compte" onPress={() => editing ? closeEditor() : setEditing(true)} disabled={picking || props.busy} expanded={editing} />
                    {props.links.map(link => <ProfileAction key={String(link.href)} icon={link.icon} label={link.label}
                        onPress={() => props.onOpenLink(link.href)} divided />)}
                </View>
                <ProfileAction icon="logout-box-r-line" label="Déconnexion" onPress={props.onSignOut} disabled={props.busy} danger />
            </View>
        </FormScrollView>
    );
}

// Ligne du menu ; la variante `danger` sert à la déconnexion (fond rosé, icône rouge, sans flèche).
function ProfileAction({icon,label,onPress,expanded,disabled,divided,danger}:{
    icon: IconName; label: string; onPress: () => void; expanded?: boolean; disabled?: boolean;
    divided?: boolean; danger?: boolean;
}) {
    return (
        <Pressable accessibilityRole="button" accessibilityState={{expanded,disabled}} onPress={onPress} disabled={disabled}
            style={({pressed}) => [styles.menuRow,divided && styles.divider,danger && styles.signOut,pressed && styles.pressed]}>
            <View style={[styles.menuIcon,danger && styles.signOutIcon]}>
                <RemixIcon name={icon} size={19} color={danger ? '#a3202c' : '#0959b0'} />
            </View>
            <Text style={[styles.rowText,danger && styles.error]}>{label}</Text>
            {!danger ? <RemixIcon name="arrow-right-s-line" color="#587394" size={21} /> : null}
        </Pressable>
    );
}
