import { API_BASE_URL, IGF_APP } from '../../constants/config';
import { getAuthSession, setAuthToken } from '../../dry-module/dry-auth/context/auth-session';

// Le type de contenu est paramétrable : la photo de profil est envoyée avec un type dédié.
async function request<T>(path: string, method: 'GET' | 'POST' | 'PATCH', payload?: object, operationKey?: string, contentType = 'application/json'): Promise<T> {
    const {token,version} = getAuthSession();
    if (!token) throw new Error('Connectez-vous pour accéder à ces données.');
    if (!API_BASE_URL) throw new Error('Adresse de l’API IGF indisponible.');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    const response = await fetch(API_BASE_URL + path.replace(/^\/+/, ''), {
        method,
        headers: {
            Authorization:`Bearer ${token}`, Accept:'application/json', 'X-IGF-App':IGF_APP,
            ...(payload ? { 'Content-Type':contentType } : {}),
            ...(operationKey ? { 'Idempotency-Key':operationKey } : {}),
        },
        signal: controller.signal,
        ...(payload ? { body:JSON.stringify(payload) } : {}),
    }).finally(() => clearTimeout(timer));
    if (getAuthSession().version !== version) throw new Error('La session a changé.');
    if (response.status === 401) {
        setAuthToken(null);
        throw new Error('Session expirée. Reconnectez-vous.');
    }
    if (response.status === 403) throw new Error('Vous n’êtes pas habilité à consulter ces dossiers.');
    if (response.status === 409) throw new Error('Une modification concurrente a eu lieu. Rouvrez la fiche.');
    if (response.status === 422) throw new Error('Vérifiez les champs ou l’état du dossier.');
    if (response.status === 413) throw new Error('Le fichier est trop volumineux. Choisissez une image plus légère.');
    if (!response.ok) throw new Error('Impossible de charger les données. Réessayez.');
    const data = await response.json() as T;
    if (getAuthSession().version !== version) throw new Error('La session a changé.');
    return data;
}

// Les filtres vides restent absents de l’URL.
function buildQueryString(params:Record<string,string|number|boolean|null|undefined>) {
    const query = new URLSearchParams();
    for (const [key,value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') query.append(key,String(value));
    }
    const value = query.toString();
    return value ? '?' + value : '';
}

// Les services métier choisissent la route. Le client garde les règles communes de session et d’erreur.
export const dryMain = {
    getAll<T>(params:Parameters<typeof buildQueryString>[0], route:string) {
        return request<T>(route + buildQueryString(params),'GET');
    },
    getById<T>(id:string, route:string) {
        return request<T>(`${route}/${encodeURIComponent(id)}`,'GET');
    },
    getOne<T>(route:string) {
        return request<T>(route,'GET');
    },
    create<T>(payload:object, route:string, operationKey?:string) {
        return request<T>(route,'POST',payload,operationKey);
    },
    update<T>(payload:object, route:string, contentType?:string) {
        return request<T>(route,'PATCH',payload,undefined,contentType);
    },
};
