import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { styles } from './ForgotPasswordScreen.styles';
import { styles as login } from './LoginScreen.styles';
import { MobileHero, RdcRibbon } from '../../../shared/component/MobileHero/MobileHero';

export function ForgotPasswordScreen() {
    return (
        <MobileLayout active="home" showTabs={false}>
            <FormScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={login.scroll}>
                <MobileHero/>
                <View style={login.sheet}>
                    <Text style={login.title}>IGF <Text style={login.pilot}>Pilot</Text></Text>
                    <Text style={login.subtitle}>Application de pilotage et de décision</Text>
                    <View style={login.flag}><View style={login.blue}/><View style={login.yellow}/><View style={login.red}/></View>
                    <View style={styles.heading}>
                        <View style={styles.icon}><RemixIcon name="lock-line" color="#0757c8" size={26} /></View>
                        <View style={styles.copy}><Text accessibilityRole="header" style={styles.title}>Mot de passe oublié</Text>
                            <Text style={styles.text}>Contactez votre administrateur pour réinitialiser votre mot de passe. Indiquez-lui votre matricule ou votre adresse professionnelle.</Text>
                        </View>
                    </View>
                    <Text style={styles.link} accessibilityRole="link" onPress={() => router.replace('/login')}>‹  Retour à la connexion</Text>
                </View>
                <RdcRibbon/>
            </FormScrollView>
        </MobileLayout>
    );
}
