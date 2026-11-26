import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    viewport:{overflow:'hidden',backgroundColor:'#073575',justifyContent:'center'},
    ribbon:{width:'100%',transform:[{scaleX:-1}]},
    image:{position:'absolute',right:0,top:0,bottom:0,width:'78%',height:'100%'},
    // Hors accueil, la photo couvre toute la largeur pour ne pas laisser de bande bleue unie à gauche.
    imageFull:{width:'100%'},
    tint:{...StyleSheet.absoluteFill,backgroundColor:'rgba(7,53,117,.69)'},
    logo:{width:'73%',maxWidth:320,aspectRatio:2.23,alignSelf:'center'},
    homeBrand:{paddingHorizontal:20,paddingBottom:29},
    homeTitle:{color:'#fff',fontSize:35,fontWeight:'900',letterSpacing:-1},
    homeSubtitle:{color:'#fff',fontSize:13,fontWeight:'600'},
    gold:{color:'#ffcf18'},
    heroRibbon:{position:'absolute',bottom:0,left:0,right:0},
});
