import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { Action } from '../Action';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';
import { styles } from './RegistryList.styles';

export interface RegistryItem { _id:string;title:string;detail?:string;label?:string }

export function RegistryList({title,subtitle,empty,state}:{title:string;subtitle:string;empty:string;
    state:{list:DryQueryResultsInterface<RegistryItem>|null;busy:boolean;error:string;load:(page?:number) => Promise<void>}}) {
    const {list,busy,error,load} = state;
    const page = list?.meta.page ?? 1;
    const total = list?.meta.totalPages ?? 0;
    return (
        <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={busy} onRefresh={() => void load(page)} />}>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {list?.data.map(item => (
                <View key={item._id} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.detail ? <Text style={styles.detail}>{item.detail}</Text> : null}
                    {item.label ? <Text style={styles.detail}>{item.label}</Text> : null}
                </View>
            ))}
            {!busy && !error && !list?.data.length ? <Text style={styles.detail}>{empty}</Text> : null}
            {total > 1 ? <View style={styles.page}>
                <Action label="Précédente" disabled={busy || page <= 1} onPress={() => void load(page-1)} />
                <Action label="Suivante" disabled={busy || page >= total} onPress={() => void load(page+1)} />
            </View> : null}
        </ScrollView>
    );
}
