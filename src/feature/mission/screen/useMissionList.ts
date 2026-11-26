import { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { useListPagination } from '../../../shared/hook/useListPagination';
import { missionService } from '../service/mission.service';

export function useMissionList() {
    const workspace = useWorkspace();
    const [q,setQuery] = useState('');
    const [search,setSearch] = useState('');
    const [status,setStatus] = useState('DEFAULT');
    useEffect(() => {
        const timer = setTimeout(() => setSearch(q.trim()),250);
        return () => clearTimeout(timer);
    },[q]);
    const request = useCallback((page:number) => missionService.search(page,search,status === 'DEFAULT' ? 'EN_REVUE' : status),[search,status]);
    return {workspace,q,setQuery,status,setStatus,...useListPagination(workspace.session,request)};
}
