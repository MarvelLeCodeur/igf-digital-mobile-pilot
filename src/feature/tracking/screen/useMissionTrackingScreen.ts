import { useRegistryScreen } from '../../../shared/hook/useRegistryScreen';
import { getPage } from '../service/MissionTracking.service';

export function useMissionTrackingScreen() {
    return useRegistryScreen(getPage);
}
