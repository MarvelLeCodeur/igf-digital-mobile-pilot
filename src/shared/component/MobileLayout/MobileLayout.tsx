import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Image, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkspace } from '../../../dry-module/dry-auth/context/AuthContext';
import { RemixIcon } from '../RemixIcon';
import type { IconName } from '../RemixIcon';
import { styles } from './MobileLayout.styles';

type Destination = {label:string;description?:string;icon:IconName;href:Href};
const tabs = [
    {id:'home',label:'Accueil',icon:'home-4-line',href:'/'},
    {id:'missions',label:'Approbations',icon:'checkbox-circle-line',href:'/missions'},
    {id:'tracking',label:'Suivi',icon:'bar-chart-2-line',href:'/tracking'},
    {id:'alerts',label:'Alertes',icon:'notification-3-line',href:'/alerts'},
    {id:'profile',label:'Profil',icon:'user-3-line',href:'/profile'},
] as const satisfies readonly (Destination & {id:string})[];

export const accountLinks = [
    {label:'Rapports',description:'Consulter les rapports de votre périmètre',icon:'file-text-line',href:'/reports'},
    {label:'Paramètres et sécurité',description:'Gérer les préférences du compte',icon:'settings-3-line',href:'/settings'},
    {label:'Entités contrôlées',icon:'government-line',href:'/entities'},
    {label:'Recommandations',icon:'clipboard-line',href:'/recommendations'},
    {label:'Aide et assistance',icon:'question-line',href:'/help'},
] as const satisfies readonly Destination[];

export function MobileLayout({children,active,showTabs=true,alertCount=0,title,back=false,hideBar=false}:PropsWithChildren<{active:string;showTabs?:boolean;alertCount?:number;title?:string;back?:boolean;hideBar?:boolean}>) {
    const [menu,setMenu] = useState(false);
    const workspace = useWorkspace();
    // Les écrans ouverts depuis le compte gardent le repère Profil dans la barre.
    const secondary = accountLinks.some(link => link.href === '/'+active);
    const home = showTabs && active === 'home';
    const profile = workspace.profile;
    const initials = profile?.displayName.trim().split(/\s+/).slice(0,2).map(part=>part[0]?.toUpperCase()).join('') || 'IGF';
    const safeEdges = showTabs && !hideBar ? ['top','left','right'] as const
        : showTabs || back ? ['top','left','right','bottom'] as const : ['left','right'] as const;

    function fromMenu(href:Href) {
        setMenu(false);
        if (href === '/'+active) return;
        if (href === '/profile') router.navigate(href);
        else router.push(href);
    }

    return (
        <SafeAreaView style={[styles.safe,!showTabs && styles.authSafe]} edges={safeEdges}>
            <StatusBar barStyle="light-content"/>
            <View style={styles.shell}>
                {showTabs || back ? <View style={styles.header}>
                    {back ? <Pressable accessibilityRole="button" accessibilityLabel="Retour" style={styles.headerAction}
                        onPress={() => {
                            if (router.canGoBack()) router.back();
                            else router.replace(secondary ? '/profile' : workspace.session ? '/' : '/login');
                        }}>
                        <RemixIcon name="arrow-left-s-line" color="#fff" />
                    </Pressable> : <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir le menu latéral" accessibilityState={{expanded:menu}}
                        style={styles.headerAction} onPress={() => setMenu(true)}><RemixIcon name="menu-line" color="#fff" /></Pressable>}
                    {home ? <View style={styles.brand}>
                        <Image source={require('../../../../assets/igf-logo-splash.png')} style={styles.logo} resizeMode="contain"
                            accessibilityLabel="Inspection générale des finances"/>
                    </View> : <Text accessibilityRole="header" style={styles.name} numberOfLines={1}>{title || 'IGF Pilot'}</Text>}
                    {showTabs ? <Pressable accessibilityRole="button" accessibilityLabel="Alertes" style={styles.headerAction} onPress={() => router.navigate('/alerts')}>
                        <RemixIcon name="notification-3-line" color="#fff" />
                        {alertCount > 0 ? <View style={styles.dot} /> : null}
                    </Pressable> : <View style={styles.headerAction} />}
                    {home ? <Pressable accessibilityRole="button" accessibilityLabel="Mon profil" style={styles.headerAction} onPress={()=>router.navigate('/profile')}>
                        {profile?.avatar ? <Image source={{uri:profile.avatar}} style={styles.avatar}/> :
                            <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>}
                    </Pressable> : null}
                </View> : null}
                <View style={styles.body}>{children}</View>
                {showTabs && !hideBar ? <SafeAreaView edges={['bottom']} style={styles.footer}>
                    <View style={styles.tabs}>
                        {tabs.map(tab => {
                            const selected = (secondary ? 'profile' : active) === tab.id;
                            return <Pressable key={tab.id} accessibilityRole="tab" accessibilityLabel={tab.label} accessibilityState={{selected}}
                                style={[styles.tab,selected && styles.selected]} onPress={() => {
                                    if (tab.id === 'missions') workspace.setSelected(null);
                                    router.navigate(tab.href);
                                }}>
                                <RemixIcon name={selected && tab.id === 'home' ? 'home-4-fill' : tab.icon} size={21}
                                    color={selected ? '#fff' : '#30476a'} />
                                <Text style={[styles.tabLabel,selected && styles.tabSelected]} numberOfLines={1} adjustsFontSizeToFit>{tab.label}</Text>
                            </Pressable>;
                        })}
                    </View>
                </SafeAreaView> : null}
            </View>
            <Modal visible={menu} transparent animationType="fade" onRequestClose={()=>setMenu(false)}>
                <View style={styles.overlay}>
                    <Pressable accessibilityRole="button" accessibilityLabel="Fermer le menu" style={styles.backdrop} onPress={()=>setMenu(false)} />
                    <SafeAreaView style={styles.drawer} accessibilityViewIsModal>
                        <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
                            <View style={styles.drawerHead}>
                                <Text style={styles.drawerTitle}>IGF Pilot</Text>
                                <Pressable accessibilityRole="button" accessibilityLabel="Fermer le menu" style={styles.close} onPress={()=>setMenu(false)}>
                                    <RemixIcon name="close-line" color="#fff" />
                                </Pressable>
                            </View>
                            <Pressable accessibilityRole="button" style={styles.drawerProfile} onPress={()=>fromMenu('/profile')}>
                                {profile?.avatar ? <Image source={{uri:profile.avatar}} style={styles.avatar}/> :
                                    <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>}
                                <View style={styles.drawerText}><Text style={styles.menuTitle}>Mon profil</Text>
                                    {profile?.displayName ? <Text style={styles.menuDescription}>{profile.displayName}</Text> : null}
                                </View>
                                <RemixIcon name="arrow-right-s-line" size={18}/>
                            </Pressable>
                            {accountLinks.map(link=><Pressable key={link.href} accessibilityRole="button" style={styles.menuItem} onPress={()=>fromMenu(link.href)}>
                                <View style={styles.menuIcon}><RemixIcon name={link.icon} size={19} color="#0755be"/></View>
                                <Text style={[styles.menuTitle,styles.drawerText]}>{link.label}</Text>
                                <RemixIcon name="arrow-right-s-line" size={18}/>
                            </Pressable>)}
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
