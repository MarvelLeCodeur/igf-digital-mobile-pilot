export const IGF_APP = 'pilot';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Indiquer le domaine HTTPS de l’API IGF Digital une fois publié.
const PRODUCTION_API_HOST = 'igf-digital-api.coryas.site';
const DEVELOPMENT_API_PORT = 5033;

function resolveDevHost() {
    const host = Platform.OS === 'web' && typeof window !== 'undefined'
        ? window.location.hostname
        : Constants.expoConfig?.hostUri?.match(/^(\[[^\]]+\]|[^:]+)/)?.[1];
    const loopback = !host || ['localhost','127.0.0.1','[::1]'].includes(host);
    if (loopback) return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
    return host;
}

function configuredApi() {
    const configured = process.env.EXPO_PUBLIC_IGF_API_URL?.trim() ||
        (!__DEV__ && PRODUCTION_API_HOST ? 'https://' + PRODUCTION_API_HOST + '/api/v1/' : '');
    if (!configured) return __DEV__ ? `http://${resolveDevHost()}:${DEVELOPMENT_API_PORT}/api/v1/` : '';
    try {
        const url = new URL(configured);
        if ((!__DEV__ && url.protocol !== 'https:') || !['http:','https:'].includes(url.protocol)
            || url.username || url.password || url.search || url.hash || url.pathname.replace(/\/+$/,'') !== '/api/v1') return '';
        return url.href.replace(/\/+$/,'') + '/';
    } catch {
        return '';
    }
}

// En développement, Metro donne l’adresse du poste, comme dans findit-mobile.
export const API_BASE_URL = configuredApi();
export const API_FILES_BASE_URL = API_BASE_URL ? new URL('/',API_BASE_URL).href : '';
