import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Redirect } from 'expo-router';
import { Text, RefreshControl, TextInput, View } from 'react-native';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { FilterChips, PrimaryAction, ScreenRow, SearchField } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { useRecommendationsScreen } from './useRecommendationsScreen';

import { recommendationStatusLabels } from '../recommendation-status';

const filters = [{value:'',label:'Toutes'},
    ...Object.entries(recommendationStatusLabels).map(([value,label]) => ({value,label}))];

const priorityLabels:Record<string,string> = {FAIBLE:'Faible',MOYENNE:'Moyenne',ELEVEE:'Élevée',CRITIQUE:'Critique'};
const evidenceFilters = [{value:'',label:'Toutes les preuves'},{value:'true',label:'Avec référence'}];

const validationFilters = [{value:'',label:'Toutes les validations'},{value:'true',label:'À valider par moi'}];

export function RecommendationsScreen() {
    const state = useRecommendationsScreen();
    if (!state.session) return <Redirect href="/login" />;
    const page = state.list?.meta.page ?? 1;
    const pages = state.list?.meta.totalPages ?? 0;
    const item = state.selected;
    const current = state.list?.data ?? [];
    return (
        <MobileLayout active="recommendations" title={item ? 'Détail de la recommandation' : state.missionId ? 'Recommandations de la mission' : 'Recommandations'} hideBar={!!item}>
            <FormScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={state.busy} onRefresh={() => void state.load(page)} />}>
                {state.error ? <Text accessibilityRole="alert" style={styles.danger}>{state.error}</Text> : null}
                {item ? <>
                    <ScreenRow icon="clipboard-line" title={item.description} subtitle={[item.missionReference,item.missionTitle].filter(Boolean).join(" · ")} badge={recommendationStatusLabels[item.status] ?? item.status} />
                    <Text style={styles.section}>Informations</Text>
                    {item.dueAt ? <Text style={styles.body}>Échéance · {new Date(item.dueAt).toLocaleDateString('fr-FR',{timeZone:'UTC'})}</Text> : null}
                    {item.priority ? <ScreenRow icon="alarm-warning-line" title="Priorité" subtitle={priorityLabels[item.priority] ?? item.priority} /> : null}
                    {item.evidenceReference ? <ScreenRow icon="file-text-line" title="Référence de la preuve" subtitle={item.evidenceReference} /> : null}
                    <Text style={styles.section}>Actions de mise en œuvre</Text>
                    {state.actions.length ? <FilterChips items={state.actions.map(value => ({value,label:state.labels[value] ?? value}))}
                        value={state.action} onChange={state.setAction} /> : <Text style={styles.body}>Aucune action autorisée à cette étape.</Text>}
                    {state.action ? <>
                        <TextInput accessibilityLabel="Motif" placeholder="Motif de la décision" style={styles.formField}
                            maxLength={500} value={state.reason} onChangeText={state.setReason} />
                        {state.action==='submit-evidence' ? <TextInput accessibilityLabel="Référence de la pièce" placeholder="Référence de la pièce"
                            style={styles.formField} maxLength={160} value={state.reference} onChangeText={state.setReference} /> : null}
                        <PrimaryAction label="Enregistrer l’action" disabled={state.saving || state.reason.trim().length<5 ||
                            (state.action==='submit-evidence' && state.reference.trim().length<3)} onPress={() => void state.apply()} />
                    </> : null}
                    {state.decisionError ? <Text style={styles.danger} accessibilityRole="alert">{state.decisionError}</Text> : null}
                    <PrimaryAction label="Retour à la liste" onPress={() => state.select(null)} />
                </> : <>
                    <SearchField value={state.text} onChange={state.setText} placeholder="Description ou référence de mission" />
                    <FilterChips items={filters} value={state.filter} onChange={state.setFilter} />
                    <FilterChips items={evidenceFilters} value={state.withEvidence ? 'true' : ''} onChange={value => state.setWithEvidence(value==='true')} />
                    <FilterChips items={validationFilters} value={state.awaitingValidation ? 'true' : ''}
                        onChange={value => state.setAwaitingValidation(value==='true')} />
                    {current.map(item => <ScreenRow key={item._id} icon="clipboard-line" title={item.description} subtitle={[item.missionReference,item.missionTitle].filter(Boolean).join(" · ")} badge={recommendationStatusLabels[item.status] ?? item.status}
                        onPress={() => state.select(item)} />)}
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
