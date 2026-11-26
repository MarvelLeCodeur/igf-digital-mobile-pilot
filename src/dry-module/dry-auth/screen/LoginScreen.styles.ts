import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    scroll:{flexGrow:1,backgroundColor:'#edf3fc'},
    sheet:{marginTop:-15,backgroundColor:'#f6f9ff',borderTopLeftRadius:28,borderTopRightRadius:28,padding:18,gap:12,flexGrow:1},
    title:{fontSize:34,fontWeight:'900',letterSpacing:-.7,textAlign:'center',color:'#101f4b'},
    pilot:{color:'#0768d6'},
    subtitle:{textAlign:'center',color:'#243a61',marginTop:-8},
    flag:{alignSelf:'center',width:103,height:5,borderRadius:3,overflow:'hidden',flexDirection:'row',marginBottom:6},
    blue:{flex:1,backgroundColor:'#0089f1'},yellow:{flex:1,backgroundColor:'#ffce00'},red:{flex:1,backgroundColor:'#f22233'},
    error:{color:'#a3202c',fontSize:13},
    field:{minHeight:52,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:12,borderWidth:1,borderColor:'#cad7eb',
        borderRadius:16,backgroundColor:'#f9fbff',elevation:1},
    input:{minHeight:48,flex:1,color:'#152a4d',fontSize:15},
    link:{fontWeight:'700',textAlign:'right',color:'#064fad',padding:8},
});
