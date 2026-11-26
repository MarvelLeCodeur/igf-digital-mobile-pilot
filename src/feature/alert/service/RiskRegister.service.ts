import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

export interface RegistryRecord { _id:string;title:string;missionTitle?:string;description?:string;status:string;reference?:string;score?:number;dueAt?:string; missionReference?:string; impact?:number; likelihood?:number; owner?:string; treatment?:string; category?:string }

export function getPage(page:number,q:string,filter:string,status?:string,category?:string) {
    return dryMain.getAll<DryQueryResultsInterface<RegistryRecord>>({page,pageSize:20,q,criticality:filter,status,category},'/risks');
}
