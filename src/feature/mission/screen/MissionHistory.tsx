import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import type { Mission } from '../../../dry-core/dry-model/dry-interface/mission.interface';
import { FilterChips, PrimaryAction, ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { useListPagination } from '../../../shared/hook/useListPagination';
import { missionService } from '../service/mission.service';

const actionLabels:Record<string,string> = {
    'missions.create':'Brouillon créé','missions.submit':'Mission soumise','missions.authorize':'Mission autorisée',
    'missions.plan':'Mission planifiée','missions.start':'Mission démarrée','missions.send-to-review':'Mission envoyée en revue',
    'missions.close':'Mission clôturée','missions.program.write':'Programme enregistré','missions.findings.create':'Constat enregistré',
    'contradictions.create':'Échange préparé','contradictions.send':'Transmission consignée',
    'contradictions.acknowledge':'Accusé de réception consigné',
    'contradictions.observations':'Observations consignées','contradictions.close':'Échange clos',
    'missions.report.write':'Rapport enregistré','missions.report.submit':'Rapport soumis',
    'missions.report.approve':'Rapport validé','missions.report.reject':'Rapport renvoyé en correction',
    'recommendations.create':'Recommandation proposée','recommendations.validate':'Recommandation validée',
    'recommendations.transmit':'Recommandation transmise','recommendations.start':'Exécution démarrée',
    'recommendations.submit-evidence':'Preuve référencée','recommendations.verify':'Preuve vérifiée',
    'recommendations.close':'Recommandation clôturée','recommendations.reopen':'Recommandation rouverte',
};

const stateLabels:Record<string,string> = {
    BROUILLON:'Brouillon',SOUMISE:'Soumise',AUTORISEE:'Autorisée',PLANIFIEE:'Planifiée',EN_COURS:'En cours',
    EN_REVUE:'En revue',TERMINEE:'Clôturée',CLOS:'Clos',VALIDE:'Validé',REJETE:'À corriger',PROPOSEE:'Proposée',
    VALIDEE:'Validée',TRANSMISE:'Transmise',PREUVE_RECUE:'Preuve référencée',VERIFICATION:'Vérifiée',
    CLOTUREE:'Clôturée',REOUVERTE:'Rouverte',TRANSMISSION_CONSIGNEE:'Transmission consignée',
    OBSERVATIONS_CONSIGNEES:'Observations consignées',
};

function HistoryEntries({mission}:{mission:Mission}) {
    const [category,setCategory] = useState('');
    const request = useCallback((page:number) => missionService.timeline(mission._id,page,category),[mission._id,category]);
    const {list,busy,error,load} = useListPagination(true,request);
    const rights = mission.workPermissions;
    // Les filtres visibles suivent les droits du dossier. Le serveur les vérifie à chaque lecture.
    const filters = [
        {value:'',label:'Toutes'},{value:'mission',label:'Mission'},
        ...(rights?.readProgram ? [{value:'program',label:'Programme'}] : []),
        ...(rights?.readFindings ? [{value:'findings',label:'Constats'}] : []),
        ...(rights?.readContradictions ? [{value:'contradictions',label:'Contradictoire'}] : []),
        ...(rights?.readReport ? [{value:'reports',label:'Rapports'}] : []),
        ...(rights?.readRecommendations ? [{value:'recommendations',label:'Recommandations'}] : []),
    ];
    const page = list?.meta.page ?? 1;
    const pages = list?.meta.totalPages ?? 0;
    return <>
        <FilterChips items={filters} value={category} onChange={setCategory} />
        {busy ? <Text style={styles.body} accessibilityLiveRegion="polite">Chargement de l’historique…</Text> : null}
        {error ? <>
            <Text style={styles.danger} accessibilityRole="alert">{error}</Text>
            <PrimaryAction label="Réessayer" disabled={busy} onPress={() => void load(page)} />
        </> : null}
        {list && !error ? <PrimaryAction label="Actualiser l’historique" disabled={busy} onPress={() => void load(page)} /> : null}
        {list?.data.map(event => <View key={event._id}>
            <ScreenRow title={actionLabels[event.action] ?? event.action} icon="calendar-line"
                subtitle={new Date(event.timestamp).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})} />
            {event.previousStatus && event.nextStatus ? <Text style={styles.body}>
                {stateLabels[event.previousStatus] ?? event.previousStatus} → {stateLabels[event.nextStatus] ?? event.nextStatus}
            </Text> : null}
            {event.reason ? <Text style={styles.body}>{event.reason}</Text> : null}
        </View>)}
        {!busy && !error && list && !list.data.length ? <Text style={styles.body}>Aucune opération dans cette rubrique.</Text> : null}
        {pages>1 ? <View style={styles.chips}>
            <PrimaryAction label="Précédente" disabled={busy || page<=1} onPress={() => void load(page-1)} />
            <Text style={styles.body}>Page {page} sur {pages}</Text>
            <PrimaryAction label="Suivante" disabled={busy || page>=pages} onPress={() => void load(page+1)} />
        </View> : null}
    </>;
}

export function MissionHistory({mission}:{mission:Mission}) {
    const [expanded,setExpanded] = useState(false);
    if (!mission.workPermissions?.readTimeline) return null;
    return <>
        <PrimaryAction label={expanded ? 'Masquer l’historique' : 'Voir l’historique'} onPress={() => setExpanded(value=>!value)} />
        {expanded ? <HistoryEntries mission={mission} /> : null}
    </>;
}
