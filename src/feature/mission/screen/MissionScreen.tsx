import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Modal, Text, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MissionHistory } from './MissionHistory';
import { reportStatusLabels } from '../../report/report-status';
import { MissionList } from './MissionList';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { FilterChips, PrimaryAction, ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles as elements } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { useApprovalDecision } from './useApprovalDecision';
import { styles } from './MissionScreen.styles';

export function MissionScreen() {
    const {workspace,editing,setEditing,confirmed,decision,setDecision,submit,close,returnToList} = useApprovalDecision();
    const {session,selected,report,reason,setReason,busy,error} = workspace;
    if (!session) return <Redirect href="/login" />;
    return (
        <MobileLayout active="missions" title={editing ? 'Décision d’approbation' : selected ? 'Détail de la demande' : undefined} hideBar={!!selected}>
            {!selected ? <MissionList /> : (
                <FormScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={elements.content}>
                    <ScreenRow icon="file-text-line" color="#bb2534" title={selected.reference ? 'Rapport – '+selected.reference : selected.title}
                        subtitle={selected.reference ? selected.title : selected.entityName} badge={report ? reportStatusLabels[report.status] ?? report.status : undefined} />
                    {error ? <Text accessibilityRole="alert" style={elements.danger}>{error}</Text> : null}
                    {editing ? <>
                        <Text style={elements.section}>Décision</Text>
                        <FilterChips items={[{value:'approve',label:'Approuver'},{value:'reject',label:'Renvoyer en correction'}]} value={decision}
                            onChange={value => setDecision(value === 'reject' ? 'reject' : 'approve')} />
                        <Text style={elements.body}>{decision === 'approve' ? 'Valider le document et autoriser la suite.' : 'Renvoyer le document pour complément.'}</Text>
                        <Text style={elements.section}>Commentaire (obligatoire)</Text>
                        <TextInput accessibilityLabel="Commentaire" placeholder="Saisissez le motif de la décision" multiline maxLength={500}
                            style={[elements.formField,styles.comment]} value={reason} onChangeText={setReason} />
                        <Text style={styles.counter}>{reason.length} / 500</Text>
                        <PrimaryAction label="Valider la décision" disabled={busy || !report?.mayApprove || reason.trim().length < 5} onPress={() => void submit()} />
                        <PrimaryAction label="Retour au détail" disabled={busy} onPress={close} />
                    </> : <>
                        <Text style={elements.section}>Résumé</Text>
                        <Text style={elements.body}>{report?.summary ?? (busy ? 'Chargement…' : selected.scope ?? 'Aucun résumé disponible.')}</Text>
                        {report?.conclusions ? <Text style={elements.body}>{report.conclusions}</Text> : null}
                        {report?.updatedAt ? <ScreenRow title="Mis à jour le" subtitle={new Date(report.updatedAt).toLocaleDateString('fr-FR')} icon="calendar-line" /> : null}
                        <ScreenRow title="Origine" subtitle={selected.entityName ?? 'Non renseignée'} icon="government-line" />
                        {report ? <ScreenRow title="Consulter le rapport" icon="file-list-3-line" onPress={() => router.push({pathname:'/report-detail',params:{id:selected._id,title:selected.title,...(selected.reference ? {reference:selected.reference} : {})}})} /> : null}
                        {report?.mayApprove ? <PrimaryAction label="Prendre une décision" onPress={() => setEditing(true)} /> : null}
                        <MissionHistory key={selected._id} mission={selected} />
                        <PrimaryAction label="Retour aux approbations" onPress={returnToList} />
                    </>}
                </FormScrollView>
            )}
            <Modal transparent animationType="fade" visible={confirmed} onRequestClose={returnToList}>
                <View style={styles.scrim}>
                    <View style={styles.dialog} accessibilityViewIsModal>
                        <View style={styles.check}><RemixIcon name="check-line" size={40} color="#17823e" /></View>
                        <Text style={elements.title}>Décision enregistrée</Text>
                        <Text style={[elements.body,elements.center]}>{workspace.feedback}</Text>
                        <ScreenRow title="Statut" subtitle={decision === 'approve' ? 'Validé' : 'À corriger'} icon="checkbox-circle-line" />
                        <PrimaryAction label="OK" onPress={returnToList} />
                    </View>
                </View>
            </Modal>
        </MobileLayout>
    );
}
