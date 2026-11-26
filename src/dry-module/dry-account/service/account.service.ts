import type { DryQueryResultInterface } from '../../../dry-core/dry-model/dry-interface';
import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { UserProfile } from '../../dry-user/model/dry-user.interface';

export const accountService = {
    getProfile() {
        return dryMain.getOne<DryQueryResultInterface<UserProfile>>('/auth/me');
    },
    updateProfile(input:{expectedVersion:number; displayName:string}) {
        return dryMain.update<DryQueryResultInterface<UserProfile>>(input, '/auth/me');
    },
};
