import { Redirect, router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { FilterChips, PrimaryAction, ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { reportStatusLabels } from '../report-status';
import { useReportDetailScreen } from './useReportDetailScreen';

export function ReportDetailScreen() {
    const {session,id,title,reference,report,busy,error,tab,setTab} = useReportDetailScreen();
    if (!session) return <Redirect href="/login" />;
    return (
        <MobileLayout active="reports" title="Détail du rapport" back hideBar>
            <ScrollView contentContainerStyle={styles.content}>
                <ScreenRow title={title ?? 'Rapport de mission'} subtitle={reference} badge={report ? reportStatusLabels[report.status] ?? report.status : undefined} icon="file-text-line" color="#c32738" />
                {report ? <Text style={styles.body}>Version {report.version}{report.updatedAt
                    ? ' · Mis à jour le '+new Date(report.updatedAt).toLocaleDateString('fr-FR') : ''}</Text> : null}
                {report ? <FilterChips items={[{value:'resume',label:'Résumé'},{value:'conclusions',label:'Conclusions'},{value:'actions',label:'Actions'}]} value={tab} onChange={setTab} /> : null}
                {error ? <Text accessibilityRole="alert" style={styles.danger}>{error}</Text> : null}
                {busy ? <Text accessibilityLiveRegion="polite" style={styles.body}>Chargement du rapport…</Text> : null}
                {!busy && !error && !report ? <Text style={styles.body}>Aucun rapport enregistré pour cette mission.</Text> : null}
                {report && tab==='resume' ? <><Text style={styles.section}>Résumé exécutif</Text><Text style={styles.body}>{report?.summary || 'Aucun résumé disponible.'}</Text></> : null}
                {report && tab==='conclusions' ? <><Text style={styles.section}>Conclusions</Text><Text style={styles.body}>{report?.conclusions || 'Aucune conclusion disponible.'}</Text></> : null}
                {report && tab==='actions' ? <PrimaryAction label="Voir les recommandations" onPress={() => router.push({pathname:'/recommendations',params:{missionId:id}})} /> : null}
            </ScrollView>
        </MobileLayout>
    );
}
