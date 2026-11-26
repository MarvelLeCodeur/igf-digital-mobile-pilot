import { Pressable, RefreshControl, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { MobileHero } from '../../../shared/component/MobileHero/MobileHero';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from './HomeScreen.styles';
import { useHomeScreen } from './useHomeScreen';

export function HomeScreen() {
    const {workspace,totals,refreshing,error,refresh,openMissions} = useHomeScreen();
    const {width,fontScale} = useWindowDimensions();
    if (!workspace.session) return <Redirect href="/login" />;
    const summary = totals?.totals;
    const pending = totals?.approvalsPending ?? '—';
    const ongoing = totals ? totals.statuses['EN_COURS'] ?? 0 : '—';
    const risks = summary?.openRisks ?? '—';
    const openTracking = () => router.navigate('/tracking');
    const openAlerts = () => router.navigate('/alerts');
    const tiles = [
        {label:'À approuver',value:pending,icon:'checkbox-circle-line',color:'#0755c7',surface:'#e0eefc',open:openMissions},
        {label:'En cours',value:ongoing,icon:'folder-3-line',color:'#956100',surface:'#fff4d7',open:openTracking},
        {label:'Alertes',value:risks,icon:'alarm-warning-line',color:'#bd1f2e',surface:'#fce7e8',open:openAlerts},
        {label:'Taux de réalisation',value:summary?.total ? Math.round(100*summary.closed/summary.total)+' %' : '—',icon:'bar-chart-2-line',color:'#147336',surface:'#e1f5e7',open:openTracking},
    ] as const;

    return (
        <MobileLayout active="home" alertCount={summary?.openRisks ?? 0}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />}>
                <MobileHero home />
                <View style={styles.sheet}>
                    <View style={styles.greeting}>
                        <View style={styles.greetingCopy}>
                            <Text accessibilityRole="header" style={styles.title}>Bonjour{workspace.profile?.displayName ? ', '+workspace.profile.displayName : ''}</Text>
                            <Text style={styles.subtitle}>Bienvenue sur IGF Pilot</Text>
                        </View>
                        <View style={styles.date}><RemixIcon name="calendar-line" size={17} color="#0755be" />
                            <Text style={styles.dateText}>{new Intl.DateTimeFormat('fr-CD',{day:'numeric',month:'short',year:'numeric'}).format(new Date())}</Text>
                        </View>
                    </View>
                    <Text accessibilityRole="header" style={styles.section}>Vue d’ensemble</Text>
                    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
                    <View style={styles.grid}>
                        {tiles.map(tile => <Pressable key={tile.label} accessibilityRole="button" onPress={tile.open}
                            style={({pressed}) => [styles.tile,{backgroundColor:tile.surface,width:width<360 || fontScale>1.2 ? '48.5%' : '23.5%'},pressed && styles.pressed]}>
                            <RemixIcon name={tile.icon} color={tile.color} size={28} />
                            <Text style={styles.metric}>{tile.value}</Text>
                            <Text style={styles.caption}>{tile.label}</Text>
                        </Pressable>)}
                    </View>
                    <ScreenRow title="Approbations en attente" subtitle="Demandes en revue" icon="file-text-line" badge={String(pending)} onPress={openMissions}/>
                    <ScreenRow title="Suivi des dossiers" subtitle="Missions en cours d’exécution" icon="folder-3-line" color="#956100" badge={String(ongoing)} onPress={openTracking}/>
                    <ScreenRow title="Alertes ouvertes" subtitle="Risques ouverts dans votre périmètre" icon="alarm-warning-line" color="#bd1f2e" badge={String(risks)} onPress={openAlerts}/>
                    {totals?.permissions.recommendations ? <ScreenRow title="Recommandations à valider" icon="clipboard-line" onPress={() => router.push('/recommendation-approvals')} /> : null}
                </View>
            </ScrollView>
        </MobileLayout>
    );
}
