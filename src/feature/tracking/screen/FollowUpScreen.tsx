import { Redirect } from 'expo-router';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { RegistryList } from '../../../shared/component/RegistryList/RegistryList';
import { useFollowUpScreen } from './useFollowUpScreen';

export function FollowUpScreen() {
    const {session,state} = useFollowUpScreen();
    if (!session) return <Redirect href="/" />;
    return (
        <MobileLayout active="tracking">
            <RegistryList title="Suivi des recommandations" subtitle="Recommandations et échéances du périmètre autorisé" empty="Aucune recommandation dans votre périmètre." state={state} />
        </MobileLayout>
    );
}
