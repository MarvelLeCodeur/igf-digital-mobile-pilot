import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/theme';

export const styles = StyleSheet.create({
    identity:{backgroundColor:'#dcecff',borderRadius:17,padding:16,alignItems:'center',gap:7,marginBottom:12},
    avatar:{height:86,width:86,borderRadius:43,backgroundColor:'#0b56ae',alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:'#fff'},
    initials:{fontSize:26,color:'#fff',fontWeight:'800'},
    identityName:{fontSize:19,fontWeight:'800',color:'#10254f',textAlign:'center'},
    identityRole:{fontSize:13,color:'#244d7a'},

    content:{flexGrow:1,padding:16,gap:10},
    shortcuts:{gap:8,marginBottom:6},
    card:{ borderWidth:1, borderColor:colors.border, backgroundColor:colors.surface, padding:18, gap:9, borderRadius:14, marginBottom:10 },
    title:{ color:colors.navy, fontSize:18, fontWeight:'700' },
    text:{ color:colors.navy, lineHeight:22 },
    label:{ color:colors.navy, fontWeight:'600' },
    input:{ borderWidth:1, borderColor:'#8392ac', color:colors.navy, minHeight:50, paddingHorizontal:12, borderRadius:8 },
    status:{ color:colors.blue, fontSize:12, fontWeight:'700' },
});
