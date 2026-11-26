import { StyleSheet } from 'react-native';

// Styles du formulaire de connexion de Pilot, alignés sur ceux d'Inspect.
// L'ancien fichier LoginScreen.styles.ts reste utilisé par l'écran « Mot de passe oublié ».
export const styles = StyleSheet.create({
    // Cadre de l'écran et en-tête clair avec le titre et le drapeau, comme dans Inspect.
    safe:{flex:1,backgroundColor:'#f6f8fc'},
    shell:{flex:1,backgroundColor:'#eef2f8'},
    header:{minHeight:66,backgroundColor:'#f6f8fc',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:14},
    headerAction:{width:44,height:44,alignItems:'center',justifyContent:'center'},
    brand:{alignItems:'center',gap:8},
    name:{color:'#0b204c',fontSize:25,fontWeight:'800',letterSpacing:-.7},
    flag:{width:106,height:4,flexDirection:'row',borderRadius:1,overflow:'hidden'},
    cyan:{flex:1,backgroundColor:'#0077f5'},
    yellow:{flex:1,backgroundColor:'#fdd600'},
    red:{flex:1,backgroundColor:'#e62023'},
    body:{flex:1},
    // Case « Se souvenir de moi ».
    remember:{flexDirection:'row',alignItems:'center',gap:10,minHeight:36},
    rememberText:{fontSize:14,fontWeight:'600',color:'#0b204c'},
    checkbox:{height:21,width:21,borderRadius:5,borderWidth:1,borderColor:'#8aa4cc',alignItems:'center',justifyContent:'center'},
    checked:{backgroundColor:'#075bb8',borderColor:'#075bb8'},
    // Conteneur général : la photo en haut, le formulaire défilant en dessous.
    loginLayout:{flex:1,minHeight:0,backgroundColor:'#f5f7fc'},
    scroll:{flexGrow:1,backgroundColor:'#f5f7fc'},
    // Photo d'en-tête et courbe aux couleurs du drapeau qui la termine.
    hero:{width:'100%',maxWidth:630,alignSelf:'center',overflow:'hidden'},
    heroPhoto:{position:'absolute',top:0,left:0,width:'100%',height:'100%'},
    heroCurve:{position:'absolute',bottom:-1,left:0,width:'100%'},
    footer:{width:'100%'},
    // Feuille du formulaire et variantes compactes (petits écrans ou clavier ouvert).
    sheet:{paddingHorizontal:'5.5%',paddingTop:17,paddingBottom:17,flexGrow:1},
    form:{width:'100%',maxWidth:500,alignSelf:'center',gap:14},
    fittedSheet:{paddingTop:8,paddingBottom:8},
    fittedForm:{gap:7},
    fittedTitle:{fontSize:28},
    fittedField:{minHeight:48},
    fittedInput:{minHeight:44},
    fittedButton:{minHeight:47},
    fittedHelp:{minHeight:41},
    // Titre, sous-titre et message d'erreur.
    heading:{alignItems:'center',gap:4,paddingBottom:3},
    title:{fontSize:32,fontWeight:'800',textAlign:'center',color:'#101f4b',letterSpacing:-.5},
    subtitle:{textAlign:'center',color:'#405778',fontSize:14,lineHeight:20},
    errorBox:{flexDirection:'row',alignItems:'center',gap:8,borderRadius:13,backgroundColor:'#fff0f2',padding:10},
    error:{flexShrink:1,color:'#a3202c',fontSize:13,lineHeight:19},
    // Champs de saisie.
    fieldGroup:{gap:6},
    field:{minHeight:54,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:9,borderWidth:1,borderColor:'#e0e7f3',
        borderRadius:13,backgroundColor:'#fafbfe',elevation:2},
    fieldFocused:{borderColor:'#2366bc',backgroundColor:'#eef5ff'},
    fieldIcon:{height:34,width:34,borderRightWidth:1,borderColor:'#ccd8eb',alignItems:'center',justifyContent:'center'},
    input:{minHeight:48,flex:1,minWidth:0,color:'#152a4d',fontSize:15,paddingVertical:8},
    reveal:{minHeight:44,minWidth:44,alignItems:'center',justifyContent:'center',borderRadius:12},
    // Bouton « Se connecter » et lien « Mot de passe oublié ».
    button:{minHeight:53,flexDirection:'row',alignItems:'center',paddingLeft:15,paddingRight:9,gap:8,borderRadius:13,elevation:3,
        backgroundColor:'#075bb8',borderWidth:1,borderColor:'#064b9c',marginTop:2},
    buttonLabel:{flex:1,fontWeight:'800',textAlign:'center',fontSize:15,paddingLeft:32,paddingVertical:7,color:'#fff'},
    buttonIcon:{width:32,height:32,alignItems:'center',justifyContent:'center',borderRadius:11,backgroundColor:'transparent'},
    disabled:{opacity:.68},
    pressed:{opacity:.76},
    help:{minHeight:44,alignItems:'center',justifyContent:'center',alignSelf:'center',paddingHorizontal:12},
    link:{fontWeight:'700',textAlign:'center',color:'#064fad'},
});
