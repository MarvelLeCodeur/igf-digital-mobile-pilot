import { useRegistryScreen } from '../../../shared/hook/useRegistryScreen';
import { getPage } from '../service/Reports.service';

export function useReportsScreen() {
    return useRegistryScreen(getPage);
}
