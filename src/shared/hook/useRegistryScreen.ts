import { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '../../dry-module/dry-auth/context/AuthContext';
import type { DryQueryResultsInterface } from '../../dry-core/dry-model/dry-interface';
import { useListPagination } from './useListPagination';

export function useRegistryScreen<T>(query:(page:number,search:string,filter:string)=>Promise<DryQueryResultsInterface<T>>) {
    const {session} = useWorkspace();
    const [text,setText] = useState('');
    const [search,setSearch] = useState('');
    const [filter,setFilter] = useState('');
    const [selected,setSelected] = useState<T|null>(null);
    useEffect(() => {
        const timer = setTimeout(() => setSearch(text.trim()),250);
        return () => clearTimeout(timer);
    },[text]);
    const fetchPage = useCallback((page:number)=>query(page,search,filter),[query,search,filter]);
    return {session,text,setText,filter,setFilter,selected,setSelected,...useListPagination(session,fetchPage)};
}
