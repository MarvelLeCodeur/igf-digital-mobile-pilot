import { API_BASE_URL, IGF_APP } from '../../../constants/config';

export async function signInLocal(username:string,password:string) {
    if (!API_BASE_URL) throw new Error('Adresse de l’API IGF indisponible.');
    const response = await fetch(API_BASE_URL+'auth/local',{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:username.trim(),password,app:IGF_APP}),
        cache:'no-store',redirect:'error',
    });
    if (response.status === 401) throw new Error('Identifiant ou mot de passe incorrect.');
    if (response.status === 429) throw new Error('Trop de tentatives. Réessayez dans une minute.');
    if (response.status === 403) throw new Error('Cet appareil n’est pas autorisé par l’API locale. Vérifiez son adresse Wi-Fi.');
    if (response.status === 404) throw new Error('La connexion locale est désactivée sur cette API.');
    if (!response.ok) throw new Error('La connexion a échoué (HTTP '+response.status+'). Réessayez.');
    const {token} = await response.json() as {token?:unknown};
    if (typeof token !== 'string' || !token) throw new Error('La session locale est invalide.');
    return token;
}

export const authService = {signInLocal};
