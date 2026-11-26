import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

export interface PendingRecommendation {
    _id:string;
    description:string;
    missionTitle:string;
    version:number;
}

export function listPending(page:number,pageSize=20) {
    return dryMain.getAll<DryQueryResultsInterface<PendingRecommendation> & {meta:{total:number}}>({page,pageSize,awaitingValidation:'true'},'/recommendations',
    );
}

export function validateRecommendation(item:PendingRecommendation,reason:string) {
    return dryMain.create({expectedVersion:item.version,reason},'/recommendations/'+encodeURIComponent(item._id)+'/validate');
}
