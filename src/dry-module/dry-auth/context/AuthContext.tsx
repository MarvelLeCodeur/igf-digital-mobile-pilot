import { useLiveUpdates } from '../../../shared/hook/useLiveUpdates';
import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { useMissionScreen } from '../../../feature/mission/screen/useMissionScreen';

type Workspace = ReturnType<typeof useMissionScreen> & {liveRevision:number};
const Context = createContext<Workspace|null>(null);

export function AuthProvider({children}:PropsWithChildren) {
    // Garder la même session quand l’agent change d’écran.
    const workspace = useMissionScreen();
    const liveRevision = useLiveUpdates();
    return <Context.Provider value={{...workspace,liveRevision}}>{children}</Context.Provider>;
}

export function useWorkspace() {
    const workspace = useContext(Context);
    if (!workspace) throw new Error('Le contexte IGF est manquant.');
    return workspace;
}
