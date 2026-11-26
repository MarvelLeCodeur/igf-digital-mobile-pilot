import { Image, Text, useWindowDimensions, View } from 'react-native';
import { styles } from './MobileHero.styles';

export function MobileHero({home=false}:{home?:boolean}) {
    const {width,height} = useWindowDimensions();
    return (
        <View style={[styles.viewport,{height:home ? Math.min(208,Math.max(145,width*.41)) : Math.min(254,Math.max(135,height*.25))}]}>
            <Image source={require('../../../../assets/igf-batiment.jpg')} resizeMode="cover" accessible={false} style={[styles.image,!home && styles.imageFull]} />
            <View style={styles.tint} pointerEvents="none"/>
            {home ? <View style={styles.homeBrand}>
                <Text style={styles.homeTitle}>IGF <Text style={styles.gold}>Pilot</Text></Text>
                <Text style={styles.homeSubtitle}>Application de pilotage et de décision</Text>
            </View> : <Image source={require('../../../../assets/igf-logo-splash.png')} resizeMode="contain" style={styles.logo}
                accessibilityLabel="Inspection générale des finances"/>}
            {/* Le bandeau suit le bord inférieur du visuel, quelle que soit la largeur. */}
            {home ? <View style={styles.heroRibbon}><RdcRibbon compact/></View> : null}
        </View>
    );
}

export function RdcRibbon({compact=false}:{compact?:boolean}) {
    const {width} = useWindowDimensions();
    const height = compact ? Math.max(32,Math.min(68,width*.11)) : Math.max(44,Math.min(100,width*.14));
    return <Image source={require('../../../../assets/rdc-ribbon.png')} style={[styles.ribbon,{height}]}
        resizeMode="stretch" accessible={false} />;
}
