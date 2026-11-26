import { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { accountLinks, MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { FormScrollView } from '../../../shared/component/FormScrollView';
import { ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { Action } from '../../../shared/component/Action';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { ProfileScreen } from './ProfileScreen';
import { styles } from './ProfileScreen.styles';

export function AccountScreen() {
    const state = useWorkspace();
    useEffect(() => {
        if (state.session) void state.openProfile();
        // Charger une fois à l’ouverture de la route pour cette session.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.session]);
    if (!state.session) return <Redirect href="/" />;
    const shortcuts = <View style={styles.shortcuts}>
        <Text accessibilityRole="header" style={styles.title}>Accès rapides</Text>
        {accountLinks.map(link=><ScreenRow key={link.href} title={link.label} icon={link.icon}
            subtitle={'description' in link ? link.description : undefined} onPress={()=>router.push(link.href)}/>)}
    </View>;
    return (
        <MobileLayout active="profile" title="Mon compte">
            <FormScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {state.error ? <Text accessibilityRole="alert">{state.error}</Text> : null}
                {state.feedback ? <Text accessibilityLiveRegion="polite">{state.feedback}</Text> : null}
                {state.profile ? <ProfileScreen profile={state.profile} displayName={state.displayName} busy={state.busy}
                    setDisplayName={state.setDisplayName} saveProfile={state.saveProfile} shortcuts={shortcuts} /> :
                    <>{shortcuts}<Action label="Charger le profil" disabled={state.busy} onPress={() => void state.openProfile()} /></>}
                <Action label="Déconnexion" disabled={state.busy} onPress={()=>Alert.alert('Se déconnecter ?', 'Votre session IGF Pilot sera fermée.',[
                    {text:'Annuler',style:'cancel'},{text:'Se déconnecter',style:'destructive',onPress:state.signOut},
                ])} />
            </FormScrollView>
        </MobileLayout>
    );
}
