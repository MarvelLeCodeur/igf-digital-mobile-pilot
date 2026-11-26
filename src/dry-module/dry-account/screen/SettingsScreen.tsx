import { Redirect, router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { useWorkspace } from '../../dry-auth/context/AuthContext';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from './SettingsScreen.styles';

export function SettingsScreen() {
    const {session} = useWorkspace();
    if (!session) return <Redirect href="/login" />;
    return (
        <MobileLayout active="settings" title="Paramètres & sécurité" back>
            <ScrollView contentContainerStyle={styles.content}>

                <ScreenRow title="Notifications" subtitle="Risques et échéances de votre périmètre" icon="notification-3-line" onPress={() => router.push('/alerts')} />
                <ScreenRow title="Session active" subtitle="Consulter vos informations d’accès dans le profil" icon="user-line" onPress={() => router.navigate('/profile')} />

                <Text style={styles.section}>Sécurité</Text>
                <ScreenRow title="Accès au compte" subtitle="Les habilitations sont gérées par votre administrateur" icon="shield-check-line" />
                <ScreenRow title="Aide et assistance" subtitle="Consulter les moyens de contact" icon="question-line" onPress={() => router.push('/help')} />
            </ScrollView>
        </MobileLayout>
    );
}
