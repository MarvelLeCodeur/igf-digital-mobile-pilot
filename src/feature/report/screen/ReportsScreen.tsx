import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Redirect, router } from 'expo-router';
import { Text, RefreshControl, View } from 'react-native';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { FilterChips, PrimaryAction, ScreenRow, SearchField } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { useReportsScreen } from './useReportsScreen';

import { reportStatusLabels } from '../report-status';

const filters = [{value:'',label:'Tous'},
    ...Object.entries(reportStatusLabels).map(([value,label]) => ({value,label}))];

export function ReportsScreen() {
    const state = useReportsScreen();
    if (!state.session) return <Redirect href="/login" />;
    const page = state.list?.meta.page ?? 1;
    const pages = state.list?.meta.totalPages ?? 0;
    const item = state.selected;
    const current = state.list?.data ?? [];
    return (
        <MobileLayout active="reports" title={item ? 'Détail du rapport' : 'Rapports'} hideBar={!!item}>
            <FormScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={state.busy} onRefresh={() => void state.load(page)} />}>
                {state.error ? <>
                    <Text accessibilityRole="alert" style={styles.danger}>{state.error}</Text>
                    <PrimaryAction label="Réessayer" disabled={state.busy} onPress={() => void state.load(page)} />
                </> : null}
                {item ? <>
                    <ScreenRow icon="file-text-line" title={item.title} subtitle={[item.reference,item.updatedAt && new Date(item.updatedAt).toLocaleDateString("fr-FR")].filter(Boolean).join(" · ") || undefined} badge={reportStatusLabels[item.status] ?? item.status} />
                    <Text style={styles.section}>Informations</Text>
                    <Text style={styles.body}>{item.title}</Text>
                    <PrimaryAction label="Consulter le rapport" onPress={() => router.push({pathname:'/report-detail',params:{id:item.missionId,title:item.title,...(item.reference ? {reference:item.reference} : {})}})} />
                    <PrimaryAction label="Retour à la liste" onPress={() => state.setSelected(null)} />
                </> : <>
                    <SearchField value={state.text} onChange={state.setText} placeholder="Intitulé ou référence de mission" />
                    <FilterChips items={filters} value={state.filter} onChange={state.setFilter} />
                    {current.map(item => <ScreenRow key={item._id} icon="file-text-line" title={item.title} subtitle={[item.reference,item.updatedAt && new Date(item.updatedAt).toLocaleDateString("fr-FR")].filter(Boolean).join(" · ") || undefined} badge={reportStatusLabels[item.status] ?? item.status}
                        onPress={() => state.setSelected(item)} />)}
                    {!state.busy && !state.error && !current.length ? <Text style={styles.body}>Aucun élément dans cette vue.</Text> : null}
                    {pages > 1 ? <View style={styles.chips}>
                        <Text style={styles.body}>Page {page} sur {pages}</Text>
                        <PrimaryAction label="Précédente" disabled={state.busy || page<=1} onPress={() => void state.load(page-1)} />
                        <PrimaryAction label="Suivante" disabled={state.busy || page>=pages} onPress={() => void state.load(page+1)} />
                    </View> : null}
                </>}
            </FormScrollView>
        </MobileLayout>
    );
}
