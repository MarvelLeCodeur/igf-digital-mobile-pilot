import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { accountLinks, MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { Action } from '../../../shared/component/Action';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { getHomeTotals } from '../../../feature/home/service/home.service';
import type { HomeTotals } from '../../../feature/home/service/home.service';
import { ProfileScreen } from './ProfileScreen';
import { useSignOutConfirmation } from './useSignOutConfirmation';
import { styles } from './ProfileScreen.styles';

export function AccountScreen() {
    const state = useWorkspace();
    const {requestSignOut,confirmation} = useSignOutConfirmation();
    // Chiffres des statistiques, chargés comme sur l'accueil ; `retry` relance le chargement après un échec.
    const [totals,setTotals] = useState<HomeTotals | null>(null);
    const [summaryFailed,setSummaryFailed] = useState(false);
    const [retry,setRetry] = useState(0);
    useEffect(() => {
        if (state.session) void state.openProfile();
        // Charger une fois à l’ouverture de la route pour cette session.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.session]);
    useEffect(() => {
        if (!state.session) return;
        let active = true;
        setTotals(null);
        setSummaryFailed(false);
        getHomeTotals().then(({data}) => {
            if (active) setTotals(data);
        }, () => {
            if (active) setSummaryFailed(true);
        });
        // Une réponse tardive d'une session fermée est ignorée.
        return () => { active = false; };
    },[state.session,retry]);
    if (!state.session) return <Redirect href="/" />;
    return (
        <MobileLayout active="profile" title="Profil">
            {state.profile ? <ProfileScreen profile={state.profile} displayName={state.displayName} busy={state.busy}
                setDisplayName={state.setDisplayName} saveProfile={state.saveProfile}
                totals={totals} summaryFailed={summaryFailed} reloadSummary={() => setRetry(value => value + 1)}
                links={accountLinks} onOpenLink={href => router.push(href)}
                error={state.error} feedback={state.feedback} onSignOut={requestSignOut} /> :
                <View style={styles.content}>
                    {state.error ? <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text> : null}
                    {state.busy ? <ActivityIndicator color="#0959c7" accessibilityLabel="Chargement du profil" /> :
                        <Action label="Charger le profil" onPress={() => void state.openProfile()} />}
                </View>}
            {/* Fenêtre de confirmation de la déconnexion. */}
            {confirmation}
        </MobileLayout>
    );
}
