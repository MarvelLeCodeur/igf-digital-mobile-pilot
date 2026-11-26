import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { useWorkspace } from '../../dry-auth/context/AuthContext';

// Fenêtre de confirmation de déconnexion, identique à celle d'Inspect.
export function useSignOutConfirmation() {
    const {signOut,busy} = useWorkspace();
    const [visible,setVisible] = useState(false);
    const close = () => setVisible(false);
    return {
        // Ouvre la fenêtre ; la session n'est fermée qu'après confirmation.
        requestSignOut:()=>setVisible(true),
        confirmation:<Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
            <View style={styles.overlay}>
                {/* Un appui en dehors de la fenêtre annule la déconnexion. */}
                <Pressable accessibilityRole="button" accessibilityLabel="Annuler la déconnexion" style={styles.backdrop} onPress={close} />
                <View accessibilityViewIsModal style={styles.dialog}>
                    <View style={styles.icon}><RemixIcon name="logout-box-r-line" color="#a7233b" size={30} /></View>
                    <Text accessibilityRole="header" style={styles.title}>Se déconnecter ?</Text>
                    <Text style={styles.body}>Vous devrez vous reconnecter pour accéder à votre espace.</Text>
                    <View style={styles.actions}>
                        <Pressable accessibilityRole="button" style={styles.cancel} onPress={close}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" disabled={busy} style={styles.confirm} onPress={()=>{
                            close();signOut();
                        }}>
                            <Text style={styles.confirmText}>Se déconnecter</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>,
    };
}

const styles = StyleSheet.create({
    overlay:{flex:1,padding:20,alignItems:'center',justifyContent:'center'},
    backdrop:{position:'absolute',top:0,left:0,bottom:0,right:0,backgroundColor:'#0a1c4473'},
    dialog:{width:'100%',maxWidth:370,padding:18,gap:9,alignItems:'center',borderRadius:23,backgroundColor:'#fbfdff',elevation:10},
    icon:{height:53,width:53,borderRadius:17,backgroundColor:'#fcecf0',alignItems:'center',justifyContent:'center'},
    title:{fontSize:22,fontWeight:'800',color:'#142953',textAlign:'center'},
    body:{fontSize:14,lineHeight:20,color:'#3b5376',textAlign:'center'},
    actions:{flexDirection:'row',alignSelf:'stretch',gap:8,marginTop:8},
    cancel:{flex:1,minHeight:46,padding:8,borderRadius:12,backgroundColor:'#ebf2fc',alignItems:'center',justifyContent:'center'},
    confirm:{flex:1,minHeight:46,padding:8,borderRadius:12,backgroundColor:'#ab243d',alignItems:'center',justifyContent:'center'},
    cancelText:{fontWeight:'800',color:'#254575',textAlign:'center'},
    confirmText:{fontWeight:'800',color:'#fff',textAlign:'center'},
});
