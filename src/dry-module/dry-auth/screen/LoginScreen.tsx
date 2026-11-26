import { FormScrollView } from '../../../shared/component/FormScrollView';
import { ActivityIndicator, Image, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { useWorkspace } from '../context/AuthContext';
import { styles } from './LoginForm.styles';

export function LoginScreen() {
    const state = useWorkspace();
    // Hauteur disponible et hauteur du formulaire : elles servent à dimensionner la photo.
    const [viewport,setViewport] = useState(0);
    const [formHeight,setFormHeight] = useState(0);
    const [visible,setVisible] = useState(false);
    const [focused,setFocused] = useState<'username'|'password'|null>(null);
    const passwordField = useRef<ComponentRef<typeof TextInput>>(null);
    const canConnect = !state.busy && !!state.username.trim() && !!state.password;
    // Le bandeau du bas est plus fin sur les petits écrans.
    const ribbonHeight = viewport > 0 && viewport < 510 ? 30 : 39;
    // Donner d'abord la place aux champs et aux boutons, puis ajuster la photo.
    const heroHeight = viewport && formHeight
        ? Math.max(30, Math.min(185, Math.floor(viewport - formHeight - ribbonHeight - 16)))
        : 115;

    // Lance la connexion uniquement si les champs sont remplis et qu'aucune connexion n'est en cours.
    function submit() {
        if (canConnect) {
            void state.connect();
        }
    }
    // Une fois connecté, Pilot passe par l'écran de première connexion.
    if (state.session) return <Redirect href="/first-access" />;
    return (
        // Le cadre protège les quatre bords : le bandeau du bas reste au-dessus de la barre de navigation Android.
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.shell}>
                {/* En-tête clair identique à celui d'Inspect : titre au centre et drapeau dessous. */}
                <View style={styles.header}>
                    <View style={styles.headerAction} />
                    <View style={styles.brand}>
                        <Text accessibilityRole="header" style={styles.name}>IGF Pilot</Text>
                        <View style={styles.flag} accessible={false}><View style={styles.cyan}/><View style={styles.yellow}/><View style={styles.red}/></View>
                    </View>
                    <View style={styles.headerAction} />
                </View>
                <View style={styles.body}>
                    <View style={styles.loginLayout} onLayout={event => setViewport(event.nativeEvent.layout.height)}>
                        {/* Photo du bâtiment IGF, propre à Pilot, avec la courbe aux couleurs du drapeau. */}
                        <View style={[styles.hero,{height:heroHeight}]}>
                            <Image source={require('../../../../assets/igf-batiment.jpg')}
                                style={styles.heroPhoto} resizeMode="cover" accessible={false} />
                            <Image source={require('../../../../assets/pilot-login-curve.png')}
                                style={[styles.heroCurve,{height:Math.min(46,Math.round(heroHeight * .28))}]} resizeMode="stretch" accessible={false} />
                        </View>
                        {/* Seul le formulaire défile. La photo reste au-dessus du clavier. */}
                        <FormScrollView contentContainerStyle={styles.scroll}>
                            <View style={[styles.sheet,styles.fittedSheet]}>
                                <View style={[styles.form,styles.fittedForm]} onLayout={event => setFormHeight(event.nativeEvent.layout.height)}>
                                    <View style={styles.heading}>
                                        <Text accessibilityRole="header" style={[styles.title,styles.fittedTitle]}>Connexion</Text>
                                        <Text style={styles.subtitle}>Accédez à votre espace de pilotage</Text>
                                    </View>
                                    {/* Message d'erreur de connexion, affiché au-dessus des champs. */}
                                    {state.error ? <View style={styles.errorBox}>
                                        <RemixIcon name="error-warning-line" size={19} color="#a3202c" />
                                        <Text accessibilityRole="alert" style={styles.error}>{state.error}</Text>
                                    </View> : null}
                                    {/* Champ identifiant : le clavier « suivant » passe au mot de passe. */}
                                    <View style={styles.fieldGroup}>
                                        <View style={[styles.field,styles.fittedField,focused === 'username' && styles.fieldFocused]}>
                                            <View style={styles.fieldIcon}><RemixIcon name="mail-line" color="#1855a1" size={19} /></View>
                                            <TextInput style={[styles.input,styles.fittedInput]} accessibilityLabel="Nom complet, matricule ou e-mail"
                                                placeholder="Nom, matricule ou e-mail" placeholderTextColor="#607394"
                                                value={state.username} onChangeText={state.setUsername} autoCapitalize="none" autoCorrect={false} autoComplete="username"
                                                onFocus={() => setFocused('username')} onBlur={() => setFocused(null)}
                                                returnKeyType="next" submitBehavior="submit" onSubmitEditing={() => passwordField.current?.focus()} />
                                        </View>
                                    </View>
                                    {/* Champ mot de passe : le clavier « aller » lance la connexion. */}
                                    <View style={styles.fieldGroup}>
                                        <View style={[styles.field,focused === 'password' && styles.fieldFocused]}>
                                            <View style={styles.fieldIcon}><RemixIcon name="lock-line" color="#1855a1" size={19} /></View>
                                            <TextInput ref={passwordField} style={styles.input} accessibilityLabel="Mot de passe"
                                                placeholder="Mot de passe" placeholderTextColor="#607394" value={state.password}
                                                onChangeText={state.setPassword} secureTextEntry={!visible} autoComplete="current-password"
                                                onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                                                returnKeyType="go" onSubmitEditing={submit} />
                                            <Pressable style={({pressed}) => [styles.reveal,pressed && styles.pressed]} accessibilityRole="button"
                                                accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                                onPress={() => setVisible(!visible)}>
                                                <RemixIcon name={visible ? 'eye-off-line' : 'eye-line'} color="#355681" size={19} />
                                            </Pressable>
                                        </View>
                                    </View>
                                    {/* Case « Se souvenir de moi », même état que dans Inspect. */}
                                    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked:state.remember }}
                                        onPress={() => state.setRemember(!state.remember)} style={styles.remember}>
                                        <View style={[styles.checkbox,state.remember && styles.checked]}>
                                            {state.remember ? <RemixIcon name="check-line" color="#fff" size={17} /> : null}
                                        </View>
                                        <Text style={styles.rememberText}>Se souvenir de moi</Text>
                                    </Pressable>
                                    <LoginButton label={state.busy ? 'Connexion…' : 'Se connecter'} busy={state.busy} disabled={!canConnect} onPress={submit} />
                                    <Pressable style={({pressed}) => [styles.help,styles.fittedHelp,pressed && styles.pressed]} accessibilityRole="link"
                                        onPress={() => router.push('/forgot-password')}>
                                        <Text style={styles.link}>Mot de passe oublié ?</Text>
                                    </Pressable>
                                </View>
                            </View>
                            {/* Vague aux couleurs du drapeau en bas de l'écran. */}
                            <Image source={require('../../../../assets/pilot-login-footer.png')}
                                style={[styles.footer,{height:ribbonHeight}]} resizeMode="stretch" accessible={false} />
                        </FormScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

// Bouton principal : libellé centré, flèche à droite, indicateur d'activité pendant la connexion.
function LoginButton({label,onPress,disabled,busy=false}:{
    label:string; onPress:()=>void; disabled:boolean; busy?:boolean;
}) {
    return (
        <Pressable accessibilityRole="button" accessibilityState={{disabled,busy}} disabled={disabled} onPress={onPress}
            style={({pressed}) => [styles.button,styles.fittedButton,disabled && styles.disabled,pressed && styles.pressed]}>
            <Text style={styles.buttonLabel}>{label}</Text>
            <View style={styles.buttonIcon}>
                {busy ? <ActivityIndicator size="small" color="#fff" /> : <RemixIcon name="arrow-right-s-line" size={21} color="#fff" />}
            </View>
        </Pressable>
    );
}
