import { useWorkspace } from '../../dry-module/dry-auth/context/AuthContext';
import type { DryQueryResultsInterface } from '../../dry-core/dry-model/dry-interface';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';


export function useListPagination<T>(session:boolean, fetchPage:(page:number) => Promise<DryQueryResultsInterface<T>>) {
    const {liveRevision} = useWorkspace();
    const seenUpdate = useRef(liveRevision);
    const currentPage = useRef(1);
    const [result,setResult] = useState<{
        query: typeof fetchPage;
        list: DryQueryResultsInterface<T>|null;
        busy: boolean;
        error: string;
    }|null>(null);
    const version = useRef(0);
    const activeQuery = useRef<typeof fetchPage|null>(null);

    useLayoutEffect(() => {
        activeQuery.current = session ? fetchPage : null;
        return () => {
            activeQuery.current = null;
            version.current++;
        };
    },[session,fetchPage]);

    const load = useCallback(async (page=1) => {
        // Une action terminée après un changement de filtre ne relance pas l’ancienne recherche.
        if (activeQuery.current !== fetchPage) return;
        currentPage.current = page;
        const id = ++version.current;
        // En actualisant le même filtre, on garde les lignes déjà chargées.
        setResult(current => ({
            query:fetchPage,
            list:current?.query === fetchPage ? current.list : null,
            busy:true,
            error:'',
        }));
        try {
            const list = await fetchPage(page);
            if (version.current === id) setResult({ query:fetchPage, list, busy:false, error:'' });
        } catch (cause) {
            if (version.current !== id) return;
            const error = cause instanceof Error ? cause.message : 'Chargement indisponible.';
            setResult(current => ({
                query:fetchPage,
                list:current?.query === fetchPage ? current.list : null,
                busy:false,
                error,
            }));
        }
    },[fetchPage]);

    useEffect(() => {
        if (!session) {
            setResult(null);
            return;
        }
        const start = setTimeout(() => void load(),0);
        return () => clearTimeout(start);
    },[session,load]);

    useEffect(() => {
        if (seenUpdate.current === liveRevision) return;
        seenUpdate.current = liveRevision;
        if (session) void load(currentPage.current);
    },[liveRevision,session,load]);

    // Un nouveau filtre masque immédiatement les anciennes lignes et erreurs.
    const current = session && result?.query === fetchPage ? result : null;
    return { list:current?.list ?? null, busy:current?.busy ?? session, error:current?.error ?? '', load };
}
