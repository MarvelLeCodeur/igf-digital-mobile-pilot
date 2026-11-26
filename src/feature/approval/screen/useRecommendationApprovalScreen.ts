import { useState } from 'react';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { useListPagination } from '../../../shared/hook/useListPagination';
import { listPending, validateRecommendation } from '../service/approval.service';
import type { PendingRecommendation } from '../service/approval.service';

export function useRecommendationApprovalScreen() {
    const {session} = useWorkspace();
    const state = useListPagination(session,listPending);
    const [selected,setSelected] = useState<PendingRecommendation|null>(null);
    const [reason,setReason] = useState('');
    const [saving,setSaving] = useState(false);
    const [message,setMessage] = useState('');
    const [saveError,setSaveError] = useState('');

    function select(item:PendingRecommendation|null) {
        setSelected(item);
        setReason('');
        setMessage('');
        setSaveError('');
    }

    async function submit() {
        if (!session || !selected || saving || reason.trim().length < 5) return;
        setSaving(true);
        setSaveError('');
        try {
            await validateRecommendation(selected,reason.trim());
            select(null);
            setMessage('Recommandation validée.');
            await state.load();
        } catch (cause) {
            setSaveError(cause instanceof Error ? cause.message : 'Validation indisponible.');
        } finally { setSaving(false); }
    }

    return {session,state,selected,select,reason,setReason,saving,message,saveError,submit};
}
