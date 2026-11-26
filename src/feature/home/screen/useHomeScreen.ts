import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { getHomeTotals } from '../service/home.service';
import type { HomeTotals } from '../service/home.service';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';

export function useHomeScreen() {
    const workspace = useWorkspace();
    const { session } = workspace;
    const [totals,setTotals] = useState<HomeTotals|null>(null);
    const [refreshing,setRefreshing] = useState(false);
    const [updated,setUpdated] = useState(false);
    const [error,setError] = useState('');
    const revision = useRef(0);


    const refresh = useCallback(async () => {
        if (!session) return;
        const request = ++revision.current;
        setRefreshing(true);
        setError('');
        try {
            const {data} = await getHomeTotals();
            if (request !== revision.current) return;
            setTotals(data);
            setUpdated(true);
        } catch (cause) {
            if (request === revision.current) {
                setUpdated(false);
                setError(cause instanceof Error ? cause.message : 'Actualisation indisponible.');
            }
        } finally {
            if (request === revision.current) setRefreshing(false);
        }
    },[session]);

    const invalidate = useCallback(() => { revision.current++; },[]);

    useEffect(() => {
        if (!session) return;
        const start = setTimeout(() => void refresh(),0);
        // Ignorer une réponse reçue après la fermeture de l’écran ou de la session.
        return () => { clearTimeout(start); invalidate(); };
    },[session,refresh,invalidate]);

    function openMissions() {
        workspace.setSelected(null);
        router.navigate('/missions');
    }

    return {workspace, totals, refreshing, updated, error, refresh, openMissions};
}
