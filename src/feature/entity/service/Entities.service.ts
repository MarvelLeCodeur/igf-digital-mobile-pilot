import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

export interface RegistryRecord { _id:string;name:string;entityType:string;code:string }

export function getPage(page:number,q:string,_filter:string) {
    return dryMain.getAll<DryQueryResultsInterface<RegistryRecord>>({page,pageSize:20,q,},'/entities');
}
