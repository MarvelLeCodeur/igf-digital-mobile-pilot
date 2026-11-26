import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { RemixIcon } from '../RemixIcon';
import type { IconName } from '../RemixIcon';
import { styles } from './ScreenElements.styles';

export function SearchField({value,onChange,placeholder}:{value:string;onChange:(value:string)=>void;placeholder:string}) {
    return <View style={styles.search}><RemixIcon name="search-line" size={19} />
        <TextInput style={styles.input} accessibilityLabel={placeholder} placeholder={placeholder} value={value} onChangeText={onChange} />
    </View>;
}

export function FilterChips({items,value,onChange}:{items:{value:string;label:string}[];value:string;onChange:(value:string)=>void}) {
    return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {items.map(item => <Pressable key={item.value} accessibilityRole="button" accessibilityState={{selected:item.value===value}}
            style={[styles.chip,item.value===value && styles.selected]} onPress={() => onChange(item.value)}>
            <Text style={[styles.chipText,item.value===value && styles.selectedText]}>{item.label}</Text>
        </Pressable>)}
    </ScrollView>;
}

export function ScreenRow({title,subtitle,badge,icon,color='#0756c8',onPress}:{
    title:string;subtitle?:string;badge?:string;icon:IconName;color?:string;onPress?:()=>void;
}) {
    const row = <><View style={styles.icon}><RemixIcon name={icon} color={color} /></View>
        <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{title}</Text>
            {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
            {badge ? <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View> : null}
        </View>
        {onPress ? <RemixIcon name="arrow-right-s-line" size={20} /> : null}
    </>;
    return onPress ? <Pressable accessibilityRole="button" style={styles.row} onPress={onPress}>{row}</Pressable> : <View style={styles.row}>{row}</View>;
}

export function PrimaryAction({label,onPress,disabled=false}:{label:string;onPress:()=>void;disabled?:boolean}) {
    return <Pressable accessibilityRole="button" disabled={disabled} style={[styles.navyButton,disabled && styles.disabled]} onPress={onPress}>
        <Text style={styles.buttonText}>{label}</Text>
    </Pressable>;
}
