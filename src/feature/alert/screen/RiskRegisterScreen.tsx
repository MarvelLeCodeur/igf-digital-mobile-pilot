import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Redirect } from 'expo-router';
import { Text, RefreshControl, View } from 'react-native';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { FilterChips, PrimaryAction, ScreenRow, SearchField } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { useRiskRegisterScreen } from './useRiskRegisterScreen';

const filters = [{value:'',label:'Toutes'},{value:'critique',label:'Critiques'},{value:'avertissement',label:'Avertissements'}];

const statuses = [{"value":"","label":"Tous les statuts"},{"value":"OUVERT","label":"Ouvert"},{"value":"EN_TRAITEMENT","label":"En traitement"},{"value":"CLOTURE","label":"Clôturé"}];
const categories = [{"value":"","label":"Toutes les catégories"},{"value":"FINANCIER","label":"Financier"},{"value":"CONFORMITE","label":"Conformité"},{"value":"OPERATIONNEL","label":"Opérationnel"},{"value":"GOUVERNANCE","label":"Gouvernance"}];

export function RiskRegisterScreen() {
    const state = useRiskRegisterScreen();
    if (!state.session) return <Redirect href="/login" />;
    const page = state.list?.meta.page ?? 1;
    const pages = state.list?.meta.totalPages ?? 0;
    const item = state.selected;
    const current = state.list?.data ?? [];
    return (
        <MobileLayout active="alerts" title={item ? 'Détail de l’alerte' : 'Centre des alertes'} hideBar={!!item}>
            <FormScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={state.busy} onRefresh={() => void state.load(page)} />}>
                {state.error ? <Text accessibilityRole="alert" style={styles.danger}>{state.error}</Text> : null}
                {item ? <>
                    <ScreenRow icon="alarm-warning-line" title={item.title} subtitle={item.missionTitle} badge={item.score === undefined ? undefined : item.score >= 15 ? "Critique" : "Avertissement"} />
                    <Text style={styles.section}>Informations</Text>
                    <Text style={styles.body}>{item.description}</Text>
                    <Text style={styles.body}>{[item.reference,item.missionReference].filter(Boolean).join(' · ')}</Text>
                    {item.impact !== undefined && item.likelihood !== undefined ? <Text style={styles.body}>Impact {item.impact} × probabilité {item.likelihood} = {item.score}/25</Text> : null}
                    {item.owner ? <Text style={styles.body}>Responsable · {item.owner}</Text> : null}
                    {item.dueAt ? <Text style={styles.body}>Échéance · {new Date(item.dueAt).toLocaleDateString('fr-FR',{timeZone:'UTC'})}</Text> : null}
                    {item.treatment ? <Text style={styles.body}>Mesure de traitement · {item.treatment}</Text> : null}
                    <PrimaryAction label="Retour à la liste" onPress={() => state.setSelected(null)} />
                </> : <>
                    <SearchField value={state.text} onChange={state.setText} placeholder="Intitulé, référence ou description" />
                    <FilterChips items={filters} value={state.filter} onChange={state.setFilter} />
                    <FilterChips items={statuses} value={state.status} onChange={state.setStatus} />
                    <FilterChips items={categories} value={state.category} onChange={state.setCategory} />
                    {current.map(item => <ScreenRow key={item._id} icon="alarm-warning-line" title={item.title} subtitle={item.missionTitle} badge={item.score === undefined ? undefined : item.score >= 15 ? "Critique" : "Avertissement"}
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
