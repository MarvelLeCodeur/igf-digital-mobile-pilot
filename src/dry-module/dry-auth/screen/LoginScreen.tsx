import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { MobileHero, RdcRibbon } from '../../../shared/component/MobileHero/MobileHero';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { PrimaryAction } from '../../../shared/component/ScreenElements/ScreenElements';
import { useWorkspace } from '../context/AuthContext';
import { styles } from './LoginScreen.styles';

export function LoginScreen() {
    const state = useWorkspace();
    const [visible,setVisible] = useState(false);
    if (state.session) return <Redirect href="/first-access" />;
    return (
        <MobileLayout active="home" showTabs={false}>
            <FormScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
                <MobileHero />
                <View style={styles.sheet}>
                    <Text accessibilityRole="header" style={styles.title}>IGF <Text style={styles.pilot}>Pilot</Text></Text>
                    <Text style={styles.subtitle}>Application de pilotage et de décision</Text>
                    <View style={styles.flag}><View style={styles.blue}/><View style={styles.yellow}/><View style={styles.red}/></View>
                    {state.error ? <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text> : null}
                    <>
                        <View style={styles.field}>
                            <RemixIcon name="user-line" size={21} />
                            <TextInput style={styles.input} accessibilityLabel="Nom complet, matricule ou e-mail" placeholder="Nom, matricule ou e-mail"
                                value={state.username} onChangeText={state.setUsername} autoCapitalize="none" autoCorrect={false} autoComplete="username" />
                        </View>
                        <View style={styles.field}>
                            <RemixIcon name="lock-line" size={21} />
                            <TextInput style={styles.input} accessibilityLabel="Mot de passe" placeholder="Mot de passe" value={state.password}
                                onChangeText={state.setPassword} secureTextEntry={!visible} autoComplete="current-password" />
                            <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                onPress={() => setVisible(!visible)} hitSlop={10}><RemixIcon name={visible ? 'eye-off-line' : 'eye-line'} size={21} /></Pressable>
                        </View>
                        <Pressable accessibilityRole="link" onPress={() => router.push('/forgot-password')}>
                            <Text style={styles.link}>Mot de passe oublié ?</Text>
                        </Pressable>
                        <PrimaryAction label={state.busy ? 'Connexion…' : 'Se connecter'} disabled={state.busy || !state.username.trim() || !state.password}
                            onPress={() => void state.connect()} />
                    </>
                    
                    
                    
                </View>
                <RdcRibbon />
            </FormScrollView>
        </MobileLayout>
    );
}
