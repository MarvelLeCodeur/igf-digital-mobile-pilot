import { useLoginScreen } from '../../../dry-module/dry-auth/screen/useLoginScreen';
import { useProfileScreen } from '../../../dry-module/dry-account/screen/useProfileScreen';
import { missionService } from '../service/mission.service';
import { useState, useSyncExternalStore } from 'react';
import { isAuthenticated, setAuthToken, subscribeAuthSession } from '../../../dry-module/dry-auth/context/auth-session';
import type { Mission, Report } from '../../../dry-core/dry-model/dry-interface/mission.interface';

export function useMissionScreen() {
    const session = useSyncExternalStore(subscribeAuthSession,isAuthenticated,isAuthenticated);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [selected, setSelected] = useState<Mission | null>(null);
    const [report, setReport] = useState<Report|null>(null);
    const [reason, setReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const { resetProfile,...profile } = useProfileScreen({session,busy,setBusy,setError,setFeedback});
    const login = useLoginScreen({busy,setBusy,setError,onConnected:connect});

    async function connect(token:string) {
        clearSession();
        setAuthToken(token);
        try { await fetchPage(1); }
        catch (cause) { clearSession(); throw cause; }
    }

    async function fetchPage(targetPage:number) {
        const result = await missionService.list(targetPage);
        setMissions(result.data);
        setPage(result.meta.page);
        setTotalPages(result.meta.totalPages);
    }

    async function load(targetPage: number) {
        if (busy) return;
        setBusy(true);
        setError('');
        try {
            await fetchPage(targetPage);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Connexion indisponible.');
        } finally { setBusy(false); }
    }

    async function open(mission: Mission) {
        if (!session || busy) return;
        setBusy(true);
        setError('');
        setFeedback('');
        setReport(null);
        setReason('');
        try {
            const response = await missionService.detail(mission._id);
            setSelected(response.data);
            if (response.data.workPermissions?.readReport) {
                const result = await missionService.report(mission._id);
                setReport(result.data);
            }
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Mission indisponible.');
        } finally { setBusy(false); }
    }

    async function submitWork(decision:'approve'|'reject' = 'approve') {
        if (!session || !selected || busy) return;
        setBusy(true);
        setError('');
        setFeedback('');
        try {
            if (report?.mayApprove && reason.trim().length >= 5) {
                const {data} = await missionService.decideReport(selected._id,decision,{
                    expectedVersion:report.version,reason:reason.trim(),
                });
                // L’API a enregistré la décision. Une seconde lecture ne doit pas conditionner sa confirmation.
                setReport({...data,mayApprove:false});
                setReason('');
                setFeedback(decision === 'approve' ? 'Rapport de travail validé.' : 'Rapport renvoyé pour correction.');
                return true;
            }
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Enregistrement indisponible.');
        } finally { setBusy(false); }
    }

    function signOut() {
        if (busy) return;
        clearSession();
    }

    function clearSession() {
        setAuthToken(null);
        setMissions([]);
        setSelected(null);
        resetProfile();
        setReport(null);
        setReason('');
        setFeedback('');
        setError('');
    }

    return {
        ...login, ...profile, session, missions, selected, setSelected, report, reason, setReason, feedback, page, totalPages, busy, error,
        load, open, submitWork, signOut, clearSession,
    };
}
