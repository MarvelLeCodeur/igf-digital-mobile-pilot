import { FormScrollView } from '../../../shared/component/FormScrollView';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SearchField, FilterChips, ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { styles } from '../../../shared/component/ScreenElements/ScreenElements.styles';
import { useMissionList } from './useMissionList';

const filters = [
    {value:'DEFAULT',label:'À approuver'},{value:'VALIDE',label:'Approuvées'},{value:'REJETE',label:'À corriger'},
];
const labels:Record<string,string> = {VALIDE:'Approuvé',REJETE:'À corriger',EN_COURS:'En cours',PLANIFIEE:'Planifiée',TERMINEE:'Clôturée',ARCHIVEE:'Archivée',EN_REVUE:'À approuver',
    BROUILLON:'Brouillon',SOUMISE:'Soumise',AUTORISEE:'Autorisée'};

export function MissionList() {
    const {workspace,q,setQuery,status,setStatus,list,busy,error,load} = useMissionList();
    const page = list?.meta.page ?? 1;
    const pages = list?.meta.totalPages ?? 0;
    return (
        <FormScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={busy} onRefresh={() => void load(page)} />}>
            <View style={layout.banner}>
                <RemixIcon name="checkbox-circle-line" size={31} color="#fff"/>
                <View style={layout.copy}>
                    <Text accessibilityRole="header" style={layout.title}>Approbations</Text>
                    <Text style={layout.caption}>Demandes soumises à décision</Text>
                </View>
                {status === 'DEFAULT' && !q.trim() && list?.meta.total != null ? <View style={layout.count}>
                    <Text style={layout.countNumber}>{list.meta.total}</Text>
                    <Text style={layout.countLabel}>en attente</Text>
                </View> : null}
            </View>
            <SearchField value={q} onChange={setQuery} placeholder="Intitulé ou référence de mission" />
            <FilterChips items={filters} value={status} onChange={setStatus} />
            {error ? <Text accessibilityRole="alert" style={styles.danger}>{error}</Text> : null}
            {list?.data.map(mission => <ScreenRow key={mission._id} icon="file-text-line" color="#bb2834"
                title={mission.reference ? 'Rapport – '+mission.reference : mission.title}
                subtitle={mission.reference ? mission.title : mission.entityName} badge={labels[mission.status] ?? mission.status}
                onPress={() => { if (!workspace.busy) void workspace.open(mission); }} />)}
            {!busy && !error && !list?.data.length ? <Text style={styles.body}>Aucun dossier dans cette vue.</Text> : null}
            {pages > 1 ? <View style={layout.pagination}>
                <Text style={[styles.body,layout.copy]}>{list?.meta.total == null ? 'Pagination' : `${list.data.length} sur ${list.meta.total} demandes`}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Page précédente" disabled={busy || page===1}
                    style={[layout.pageButton,(busy || page===1) && layout.disabled]} onPress={()=>void load(page-1)}>
                    <RemixIcon name="arrow-left-s-line" size={19}/>
                </Pressable>
                <Text accessibilityLiveRegion="polite" style={styles.body}>{page} / {pages}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Page suivante" disabled={busy || page>=pages}
                    style={[layout.pageButton,(busy || page>=pages) && layout.disabled]} onPress={()=>void load(page+1)}>
                    <RemixIcon name="arrow-right-s-line" size={19}/>
                </Pressable>
            </View> : null}
        </FormScrollView>
    );
}

const layout = StyleSheet.create({
    banner:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#073b80',padding:13,borderRadius:18},
    copy:{flex:1},
    title:{color:'#fff',fontSize:22,fontWeight:'900'},
    caption:{color:'#e1eeff',fontSize:12,marginTop:2},
    count:{paddingHorizontal:9,paddingVertical:6,alignItems:'center',borderRadius:12,backgroundColor:'#fff4d7'},
    countNumber:{fontSize:18,color:'#6d4700',fontWeight:'900'},
    countLabel:{fontSize:10,color:'#6d4700',fontWeight:'700'},
    pagination:{flexDirection:'row',alignItems:'center',gap:8,marginTop:5},
    pageButton:{width:44,height:44,alignItems:'center',justifyContent:'center',borderRadius:12,borderWidth:1,borderColor:'#cfdbed',backgroundColor:'#fbfcff'},
    disabled:{opacity:.4},
});
