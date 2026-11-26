import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    sheet:{marginTop:-6,borderTopLeftRadius:27,borderTopRightRadius:27,backgroundColor:'#f3f7fd',padding:16,gap:10},
    greeting:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:9,justifyContent:'space-between',paddingBottom:5},
    greetingCopy:{flexShrink:1},
    title:{fontSize:22,fontWeight:'900',color:'#101f4a'},
    subtitle:{fontSize:13,color:'#375175',marginTop:3},
    section:{fontSize:19,fontWeight:'800',color:'#101f4a',marginTop:4},
    date:{flexDirection:'row',alignItems:'center',gap:5,borderRadius:9,backgroundColor:'#e6effb',padding:7},
    dateText:{fontSize:11,fontWeight:'700',color:'#163c78'},
    grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10,marginBottom:5},
    tile:{minHeight:89,paddingVertical:9,paddingHorizontal:3,borderRadius:14,gap:3,alignItems:'center',justifyContent:'center'},
    caption:{fontSize:10,color:'#203553',textAlign:'center',fontWeight:'600'},
    metric:{fontWeight:'900',fontSize:21,color:'#10234e'},
    pressed:{opacity:.75},
    error:{color:'#af2638'},
});
