import { Redirect, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useWorkspace } from '../context/AuthContext';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { MobileHero, RdcRibbon } from '../../../shared/component/MobileHero/MobileHero';
import { PrimaryAction, ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from './FirstAccessScreen.styles';

export function FirstAccessScreen() {
    const state = useWorkspace();
    if (!state.session) return <Redirect href="/login" />;
    return (
        <MobileLayout active="home" showTabs={false}>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <MobileHero />
                <View style={styles.sheet}>
                    <Text style={styles.title}>Bienvenue dans IGF Pilot !</Text>
                    <Text style={styles.caption}>Choisissez l’espace de travail à ouvrir.</Text>
                <ScreenRow title="Responsable" subtitle="Consulter et traiter les demandes autorisées" icon="user-line" onPress={() => router.replace('/missions')} />
                <ScreenRow title="Décideur" subtitle="Suivre les missions et consulter les alertes" icon="group-line" onPress={() => router.replace('/tracking')} />
                <View style={styles.modules}>
                    <Text style={styles.module}>Validations</Text><Text style={styles.module}>Suivi</Text><Text style={styles.module}>Alertes</Text>
                </View>
                    <PrimaryAction label="Accéder à l’espace" onPress={() => router.replace('/')} />
                </View>
                <View style={{marginTop:'auto'}}><RdcRibbon /></View>
            </ScrollView>
        </MobileLayout>
    );
}
