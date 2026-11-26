import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { RegistryItem } from '../../../shared/component/RegistryList/RegistryList';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

interface Row { _id:string;title:string;missionTitle?:string;score?:number }

export async function getPage(page:number):Promise<DryQueryResultsInterface<RegistryItem>> {
    const result = await dryMain.getAll<DryQueryResultsInterface<Row>>({page,pageSize:20,status:'OUVERT'},'/risks');
    return {meta:result.meta,data:result.data.map(item => ({_id:item._id,title:item.title,detail:item.missionTitle,label:item.score !== undefined ? "Score de risque ? " + item.score : undefined}))};
}
