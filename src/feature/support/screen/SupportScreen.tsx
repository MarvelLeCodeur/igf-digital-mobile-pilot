import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { MobileLayout } from '../../../shared/component/MobileLayout/MobileLayout';
import { RemixIcon } from '../../../shared/component/RemixIcon';
import { ScreenRow } from '../../../shared/component/ScreenElements/ScreenElements';
import { styles } from './SupportScreen.styles';

const sections = {
    faq:'Sur le réseau local, démarrez l’API et vérifiez que le téléphone peut joindre le poste qui lance Metro. Si aucun dossier ne s’affiche, vérifiez les habilitations de votre compte.',
    support:'Contactez votre administrateur IGF Digital. Indiquez le nom de l’application, l’écran concerné et le message affiché.',
    about:'Application mobile de l’Inspection générale des finances de la République démocratique du Congo.',
};

export function SupportScreen() {
    const [selected,setSelected] = useState<keyof typeof sections|null>(null);
    return (
        <MobileLayout active="home" showTabs={false} title="Aide & Support" back>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hero}>
                    <RemixIcon name="question-line" size={56} color="#0756c5" />
                    <Text style={styles.title}>Besoin d’aide ?</Text>
                    <Text style={styles.body}>Consultez la FAQ ou contactez l’équipe d’assistance.</Text>
                </View>
                <ScreenRow title="FAQ – Questions fréquentes" subtitle="Trouvez rapidement une réponse" icon="file-list-3-line" onPress={() => setSelected('faq')} />
                <ScreenRow title="Contacter le support" subtitle="Assistance technique" icon="mail-line" onPress={() => setSelected('support')} />
                <ScreenRow title="À propos de l’application" subtitle="Informations sur IGF Pilot" icon="question-line" onPress={() => setSelected('about')} />
                {selected ? <Text style={styles.answer}>{sections[selected]}</Text> : null}
            </ScrollView>
        </MobileLayout>
    );
}
