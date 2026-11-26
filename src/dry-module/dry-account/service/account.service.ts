import type { DryQueryResultInterface } from '../../../dry-core/dry-model/dry-interface';
import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { UserProfile } from '../../dry-user/model/dry-user.interface';

export const accountService = {
    getProfile() {
        return dryMain.getOne<DryQueryResultInterface<UserProfile>>('/auth/me');
    },
    // La photo est envoyée avec le type de contenu dédié attendu par l'API ; sans photo, le type JSON habituel est utilisé.
    updateProfile(input:{expectedVersion:number; displayName:string; avatar?:string|null}) {
        return dryMain.update<DryQueryResultInterface<UserProfile>>(input, '/auth/me', typeof input.avatar === 'string' ? 'application/vnd.igf.avatar+json' : undefined);
    },
};
