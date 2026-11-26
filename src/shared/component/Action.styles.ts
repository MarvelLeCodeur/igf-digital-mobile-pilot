import { StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export const styles = StyleSheet.create({
    action:{ minHeight:46, justifyContent:'center', backgroundColor:colors.blue, borderRadius:9, paddingHorizontal:12, paddingVertical:8 },
    disabled:{ opacity:0.5 },
    actionText:{ color:colors.surface, textAlign:'center', fontWeight:'600' },
});
