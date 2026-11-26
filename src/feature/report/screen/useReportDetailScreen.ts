import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { missionService } from '../../mission/service/mission.service';
import type { Report } from '../../../dry-core/dry-model/dry-interface/mission.interface';

export function useReportDetailScreen() {
    const {session} = useWorkspace();
    const {id,title,reference} = useLocalSearchParams<{id:string;title?:string;reference?:string}>();
    const [result,setResult] = useState<{id:string;report:Report|null;error:string}|null>(null);
    const [tab,setTab] = useState('resume');
    useEffect(() => {
        setResult(null);
        setTab('resume');
        if (!session || !id) return;
        let current = true;
        // Un rapport reçu après la fermeture de sa fiche ne doit pas remplacer le suivant.
        void missionService.report(id).then(response => {
            if (current) setResult({id,report:response.data,error:''});
        }).catch(cause => {
            if (current) setResult({id,report:null,error:cause instanceof Error ? cause.message : 'Rapport indisponible.'});
        });
        return () => { current=false; };
    },[id,session]);
    const current = session && result?.id === id ? result : null;
    return {session,id,title,reference,report:current?.report ?? null,busy:!!id && !current,
        error:current?.error || (!id ? 'Rapport introuvable.' : ''),tab,setTab};
}
