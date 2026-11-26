import { Tabs } from 'expo-router';

export default function TabsLayout() {
    // MobileLayout dessine la barre. Expo Router utilise cette liste pour afficher les écrans.
    return (
        <Tabs screenOptions={{headerShown:false}} tabBar={() => null}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="missions" />
            <Tabs.Screen name="tracking" />
            <Tabs.Screen name="alerts" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}
