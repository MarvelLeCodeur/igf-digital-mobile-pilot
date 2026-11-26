import { useCallback, useState } from 'react';
import { useRegistryScreen } from '../../../shared/hook/useRegistryScreen';
import { getPage } from '../service/RiskRegister.service';

export function useRiskRegisterScreen() {
    const [status,setStatus] = useState('');
    const [category,setCategory] = useState('');
    // Conserver la recherche et la criticité quand une autre dimension du filtre change.
    const query = useCallback((page:number,q:string,filter:string) => getPage(page,q,filter,status,category),[status,category]);
    return {...useRegistryScreen(query),status,setStatus,category,setCategory};
}
