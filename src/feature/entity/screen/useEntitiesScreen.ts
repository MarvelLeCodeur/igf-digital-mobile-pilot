import { useRegistryScreen } from '../../../shared/hook/useRegistryScreen';
import { getPage } from '../service/Entities.service';

export function useEntitiesScreen() {
    return useRegistryScreen(getPage);
}
