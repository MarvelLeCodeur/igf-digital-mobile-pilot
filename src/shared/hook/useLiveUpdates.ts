import { useEffect, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { API_BASE_URL } from '../../constants/config';
import { getAuthSession, subscribeAuthSession } from '../../dry-module/dry-auth/context/auth-session';

const readToken = () => getAuthSession().token;

export function useLiveUpdates() {
    const token = useSyncExternalStore(subscribeAuthSession,readToken,readToken);
    const [revision,setRevision] = useState(0);
    useEffect(() => {
        if (!token || !API_BASE_URL) return;
        const url = new URL('live',API_BASE_URL);
        url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        let socket:WebSocket|undefined;
        let retry:ReturnType<typeof setTimeout>|undefined;
        let handshake:ReturnType<typeof setTimeout>|undefined;
        let active = AppState.currentState === 'active' || AppState.currentState === null;
        let delay = 1000;

        function connect() {
            if (!active || socket) return;
            const current = socket = new WebSocket(url.href);
            handshake = setTimeout(()=>current.close(),7000);
            current.onopen = () => current.send(JSON.stringify({type:'authenticate',app:'pilot',token}));
            current.onmessage = ({data}) => {
                if (!active || socket !== current) return;
                try {
                    const {type} = JSON.parse(data);
                    if (type === 'ready') { clearTimeout(handshake); delay=1000; }
                    if (type === 'ready' || type === 'changed') setRevision(value=>value+1);
                } catch { /* Ignorer les messages qui ne suivent pas le protocole. */ }
            };
            current.onclose = ({code}) => {
                if (socket !== current) return;
                socket = undefined;
                clearTimeout(handshake);
                if (!active || code === 1008) return;
                retry = setTimeout(connect,delay+Math.floor(Math.random()*300));
                delay = Math.min(delay*2,30000);
            };
        }

        function close() {
            clearTimeout(retry);
            clearTimeout(handshake);
            const previous = socket;
            socket = undefined;
            previous?.close();
        }

        // Le canal reste ouvert uniquement quand l’application est au premier plan.
        const subscription = AppState.addEventListener('change',state=>{
            const wasActive = active;
            active = state === 'active';
            if (!active) close();
            else if (!wasActive) { delay=1000; connect(); }
        });
        connect();
        return () => { active=false; subscription.remove(); close(); };
    },[token]);
    return revision;
}
