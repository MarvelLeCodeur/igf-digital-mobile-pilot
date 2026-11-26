import { StyleSheet } from 'react-native';

// Styles du profil, repris de ceux d'Inspect pour garder exactement le même design.
const navy = '#10244c';
const secondary = '#3e577a';
const border = '#e1e9f4';
const shadow = {
    shadowColor:'#183967', shadowOffset:{width:0,height:4}, shadowOpacity:.08, shadowRadius:10, elevation:2,
} as const;

export const styles = StyleSheet.create({
    content:{width:'100%',maxWidth:560,alignSelf:'center',paddingHorizontal:17,paddingTop:9,paddingBottom:26,gap:19},
    // Carte d'identité : portrait, nom, fonction et coordonnées.
    identityCard:{backgroundColor:'#fff',borderWidth:1,borderColor:border,borderRadius:22,...shadow},
    identity:{flexDirection:'row',alignItems:'center',gap:15,padding:15,borderTopLeftRadius:21,borderTopRightRadius:21,
        overflow:'hidden',backgroundColor:'#eaf3ff',backgroundImage:'linear-gradient(130deg, #eaf4ff 0%, #dcecff 100%)'},
    identityGlow:{position:'absolute',right:-41,top:-89,width:190,height:190,borderRadius:95,borderWidth:19,borderColor:'#ffffff58'},
    identityDetails:{flex:1,gap:7},
    portrait:{paddingRight:4,paddingBottom:3},
    avatar:{height:74,width:74,borderRadius:20,backgroundColor:'#d1e5ff',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#fff'},
    initials:{fontSize:26,color:'#084f9e',fontWeight:'800'},
    edit:{position:'absolute',bottom:0,right:0,width:33,height:33,borderRadius:17,borderWidth:2,borderColor:'#fff',backgroundColor:'#075cb9',
        alignItems:'center',justifyContent:'center',elevation:2},
    identityName:{fontSize:20,color:navy,fontWeight:'800',letterSpacing:-.35},
    role:{flexDirection:'row',alignItems:'center',gap:5,alignSelf:'flex-start',maxWidth:'100%',borderRadius:10,backgroundColor:'#ffffffc9',paddingHorizontal:8,paddingVertical:5},
    identityRole:{fontSize:12,color:'#234a79',fontWeight:'700',flexShrink:1},
    rows:{paddingHorizontal:12,paddingVertical:3},
    row:{minHeight:48,flexDirection:'row',alignItems:'center',paddingHorizontal:3,paddingVertical:6,gap:9},
    divider:{borderTopWidth:1,borderTopColor:'#eaf0f8'},
    rowText:{flex:1,color:navy,fontSize:14,fontWeight:'600'},
    contactIcon:{width:31,height:31,borderRadius:9,alignItems:'center',justifyContent:'center',backgroundColor:'#eef5ff'},
    contactDetails:{flex:1,gap:2},
    contactLabel:{fontSize:11,color:secondary,fontWeight:'600'},
    // Éditeur du profil (nom et photo).
    card:{backgroundColor:'#fff',borderWidth:1,borderColor:border,borderRadius:19,padding:14,gap:10,...shadow},
    title:{color:navy,fontSize:17,fontWeight:'800',letterSpacing:-.2},
    // Statistiques : trois cartes colorées côte à côte.
    stats:{gap:9},
    heading:{flexDirection:'row',alignItems:'center'},
    metrics:{flexDirection:'row',gap:8},
    metric:{flex:1,minHeight:96,borderRadius:15,alignItems:'center',justifyContent:'center',paddingHorizontal:4,paddingVertical:8,gap:2,
        borderWidth:1,borderColor:'#ffffffb5',...shadow},
    metricIcon:{width:28,height:28,borderRadius:9,alignItems:'center',justifyContent:'center',backgroundColor:'#ffffffb5'},
    count:{fontSize:22,fontVariant:['tabular-nums'],fontWeight:'800',color:navy},
    metricLabel:{fontSize:11,textAlign:'center',fontWeight:'700',color:navy},
    // Menu « Mon espace » et ligne de déconnexion.
    menu:{gap:9},
    menuGroup:{backgroundColor:'#fff',borderWidth:1,borderColor:border,borderRadius:17,...shadow},
    menuRow:{minHeight:48,flexDirection:'row',alignItems:'center',paddingHorizontal:11,paddingVertical:6,gap:10},
    menuIcon:{width:34,height:34,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#eef5ff'},
    signOut:{borderRadius:14,backgroundColor:'#fff9fa',borderWidth:1,borderColor:'#f1dce1'},
    signOutIcon:{backgroundColor:'#fcebf0'},
    pressed:{opacity:.72},
    photoActions:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:8},
    photoButton:{minHeight:44,paddingHorizontal:11,paddingVertical:7,flexDirection:'row',alignItems:'center',gap:7,borderRadius:11,backgroundColor:'#eaf3ff'},
    removePhoto:{minHeight:44,paddingHorizontal:10,justifyContent:'center'},
    cancelEdit:{minHeight:40,alignItems:'center',justifyContent:'center'},
    label:{fontSize:13,color:secondary,fontWeight:'600'},
    input:{minHeight:49,borderWidth:1,borderColor:'#bed3ef',backgroundColor:'#f8fbff',borderRadius:12,paddingHorizontal:12,color:navy},
    link:{color:'#064fad',fontWeight:'700'},
    error:{color:'#a3202c'},
    feedback:{color:'#176b43'},
});
