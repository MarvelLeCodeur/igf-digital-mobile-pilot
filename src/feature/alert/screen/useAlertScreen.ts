import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { useListPagination } from '../../../shared/hook/useListPagination';
import { getPage } from '../service/alert.service';

export function useAlertScreen() {
    const {session} = useWorkspace();
    return {session,state:useListPagination(session,getPage)};
}
