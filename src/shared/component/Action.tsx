import { Pressable, Text } from 'react-native';
import { styles } from './Action.styles';

export function Action({ label, onPress, disabled }: { label:string; onPress:() => void; disabled?:boolean }) {
    return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
        style={[styles.action, disabled && styles.disabled]} onPress={onPress}><Text style={styles.actionText}>{label}</Text></Pressable>;
}
