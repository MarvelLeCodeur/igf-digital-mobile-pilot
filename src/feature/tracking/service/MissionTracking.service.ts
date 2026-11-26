import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

export interface RegistryRecord { _id:string;title:string;scope?:string;status:string;progress?:number }

export function getPage(page:number,q:string,filter:string) {
    return dryMain.getAll<DryQueryResultsInterface<RegistryRecord>>({page,pageSize:20,q,...(filter ? {status:filter} : {})},'/missions');
}
