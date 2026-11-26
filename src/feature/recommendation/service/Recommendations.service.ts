import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

export interface RegistryRecord { _id:string;description:string;missionTitle?:string;missionReference?:string;status:string;dueAt?:string;priority?:string;evidenceReference?:string;version:number;recommendationActions?:string[];mayValidate?:boolean }

export function getPage(page:number,q:string,filter:string,missionId?:string,withEvidence=false,awaitingValidation=false) {
    return dryMain.getAll<DryQueryResultsInterface<RegistryRecord>>({page,pageSize:20,q,status:filter,...(missionId ? {missionId} : {}),...(withEvidence ? {withEvidence:true} : {}),...(awaitingValidation ? {awaitingValidation:true} : {})},'/recommendations');
}

export function decideRecommendation(record:RegistryRecord,action:string,reason:string,evidenceReference:string) {
    return dryMain.create({
        expectedVersion:record.version,reason,
        ...(action === 'submit-evidence' ? {evidenceReference} : {}),
    },'/recommendations/'+encodeURIComponent(record._id)+'/'+encodeURIComponent(action));
}
