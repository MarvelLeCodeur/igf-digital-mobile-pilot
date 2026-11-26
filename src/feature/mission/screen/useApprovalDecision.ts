import { useState } from 'react';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';

export function useApprovalDecision() {
    const workspace = useWorkspace();
    const [editing,setEditing] = useState(false);
    const [confirmed,setConfirmed] = useState(false);
    const [decision,setDecision] = useState<'approve'|'reject'>('approve');
    function close() {
        setEditing(false);
        setConfirmed(false);
        workspace.setReason('');
    }
    async function submit() {
        if (await workspace.submitWork(decision)) setConfirmed(true);
    }
    function returnToList() {
        close();
        workspace.setSelected(null);
    }
    return {workspace,editing,setEditing,confirmed,decision,setDecision,submit,close,returnToList};
}
