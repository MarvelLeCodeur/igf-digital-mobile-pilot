// Une seule session par application. Les écrans ne manipulent jamais le jeton.
let token:string|null = null;
let version = 0;
const listeners = new Set<() => void>();

export function getAuthSession() { return {token,version}; }
export function isAuthenticated() { return token !== null; }

export function subscribeAuthSession(listener:() => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function setAuthToken(value:string|null) {
    token = value;
    version++;
    listeners.forEach(listener => listener());
}
