import { Redirect } from 'expo-router';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { RegistryList } from '../../../shared/component/RegistryList/RegistryList';
import { useAlertScreen } from './useAlertScreen';

export function AlertScreen() {
    const {session,state} = useAlertScreen();
    if (!session) return <Redirect href="/" />;
    return (
        <MobileLayout active="alerts">
            <RegistryList title="Alertes" subtitle="Risques ouverts dans votre périmètre" empty="Aucun risque ouvert." state={state} />
        </MobileLayout>
    );
}
