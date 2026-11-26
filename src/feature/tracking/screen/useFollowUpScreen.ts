import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { useListPagination } from '../../../shared/hook/useListPagination';
import { getPage } from '../service/tracking.service';

export function useFollowUpScreen() {
    const {session} = useWorkspace();
    return {session,state:useListPagination(session,getPage)};
}
