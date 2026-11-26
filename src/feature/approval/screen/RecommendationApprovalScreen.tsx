import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Action } from '../../../shared/component/Action';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { styles } from './RecommendationApprovalScreen.styles';
import { useRecommendationApprovalScreen } from './useRecommendationApprovalScreen';

export function RecommendationApprovalScreen() {
    const {session,state,selected,select,reason,setReason,saving,message,saveError,submit} = useRecommendationApprovalScreen();
    if (!session) return <Redirect href="/" />;
    const page = state.list?.meta.page ?? 1;
    const totalPages = state.list?.meta.totalPages ?? 0;

    return (
        <MobileLayout active="missions">
            <FormScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
                refreshControl={<RefreshControl refreshing={state.busy} onRefresh={() => void state.load(page)} />}>
                <Text accessibilityRole="header" style={styles.title}>Recommandations à valider</Text>
                {state.error || saveError ? <Text accessibilityRole="alert" style={styles.error}>{saveError || state.error}</Text> : null}
                {message ? <Text accessibilityLiveRegion="polite" style={styles.success}>{message}</Text> : null}
                {selected ? (
                    <View style={styles.card}>
                        <Text style={styles.title}>{selected.missionTitle}</Text>
                        <Text style={styles.text}>{selected.description}</Text>
                        <TextInput accessibilityLabel="Motif de la validation" placeholder="Motif de la validation" multiline maxLength={500}
                            style={styles.input} value={reason} onChangeText={setReason} />
                        <Action label="Valider la recommandation" disabled={saving || reason.trim().length < 5} onPress={() => void submit()} />
                        <Action label="Retour aux demandes" disabled={saving} onPress={() => select(null)} />
                    </View>
                ) : (
                    <>
                        {state.list?.data.map(item => (
                            <Pressable key={item._id} accessibilityRole="button" style={styles.card} onPress={() => select(item)}>
                                <Text style={styles.title}>{item.missionTitle}</Text>
                                <Text style={styles.text}>{item.description}</Text>
                            </Pressable>
                        ))}
                        {!state.busy && !state.error && !state.list?.data.length ? <Text style={styles.text}>Aucune demande dans votre périmètre.</Text> : null}
                        {totalPages > 1 ? <View style={styles.pagination}>
                            <Action label="Précédente" disabled={state.busy || page <= 1} onPress={() => void state.load(page - 1)} />
                            <Action label="Suivante" disabled={state.busy || page >= totalPages} onPress={() => void state.load(page + 1)} />
                        </View> : null}
                    </>
                )}
            </FormScrollView>
        </MobileLayout>
    );
}
