// Ouvre la photothèque et renvoie la photo choisie : son adresse locale pour l'aperçu, et ses données pour l'envoi.
export async function pickProfilePhoto() {
    // Le module natif est chargé au moment du choix, et non au démarrage : une application installée
    // avant son ajout continue ainsi d'ouvrir le profil, et affiche un message clair au lieu de planter.
    const picker = await import('expo-image-picker').catch(() => null);
    if (!picker) throw new Error('Le choix de photo nécessite la dernière version de l’application. Installez la nouvelle version.');
    // Le recadrage natif permet de cadrer le visage avant d'afficher l'aperçu.
    const result = await picker.launchImageLibraryAsync({
        mediaTypes:['images'], allowsEditing:true, aspect:[1,1], base64:true, quality:.55,
    });
    if (result.canceled) return null;
    const photo = result.assets[0];
    if (!photo.base64) throw new Error('Cette photo ne peut pas être lue.');
    // Limites alignées sur celles de l'API (3 Mo et 25 millions de pixels).
    if (photo.base64.length > 2_999_900 || photo.width * photo.height > 25_000_000) {
        throw new Error('Cette photo est trop grande. Choisissez une image plus légère.');
    }
    return { uri:photo.uri, data:'data:image/jpeg;base64,' + photo.base64 };
}
