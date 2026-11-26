import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useRegistryScreen } from '../../../shared/hook/useRegistryScreen';
import { decideRecommendation, getPage } from '../service/Recommendations.service';
import type { RegistryRecord } from '../service/Recommendations.service';

const labels:Record<string,string> = {
    validate:'Valider',transmit:'Transmettre',start:'Démarrer', 'submit-evidence':'Déposer une référence',
    verify:'Vérifier',close:'Clôturer',reopen:'Rouvrir',
};

export function useRecommendationsScreen() {
    const {missionId} = useLocalSearchParams<{missionId?:string}>();
    const [withEvidence,setWithEvidence] = useState(false);
    const [awaitingValidation,setAwaitingValidation] = useState(false);
    const query = useCallback((page:number,q:string,filter:string) => getPage(page,q,filter,missionId,withEvidence,awaitingValidation),[missionId,withEvidence,awaitingValidation]);
    const state = useRegistryScreen(query);
    const {setSelected} = state;
    // Un rapport ouvre sa propre liste, même lorsqu’une autre recommandation était affichée.
    useEffect(() => { setSelected(null); },[missionId,setSelected]);
    const [action,setAction] = useState('');
    const [reason,setReason] = useState('');
    const [reference,setReference] = useState('');
    const [saving,setSaving] = useState(false);
    const [decisionError,setDecisionError] = useState('');
    const actions = [...(state.selected?.mayValidate ? ['validate'] : []),...(state.selected?.recommendationActions ?? [])];

    function select(item:RegistryRecord|null) {
        state.setSelected(item);
        setAction('');
        setReason('');
        setReference('');
        setDecisionError('');
    }
    async function apply() {
        const note = reason.trim();
        const proof = reference.trim();
        // Vérifier les mêmes longueurs que l’API avant de lancer la décision.
        if (saving || !state.selected || !actions.includes(action) || note.length<5 || note.length>500) return;
        if (action==='submit-evidence' && (proof.length<3 || proof.length>160)) return;
        setSaving(true);
        setDecisionError('');
        try {
            await decideRecommendation(state.selected,action,note,proof);
            select(null);
            // Revenir à la première page après un changement de statut.
            await state.load();
        } catch(cause) {
            setDecisionError(cause instanceof Error ? cause.message : 'Impossible d’enregistrer.');
        } finally { setSaving(false); }
    }
    return {...state,missionId,awaitingValidation,setAwaitingValidation,withEvidence,setWithEvidence,action,setAction,reason,setReason,reference,setReference,saving,decisionError,actions,labels,select,apply};
}
