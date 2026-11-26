import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { RegistryItem } from '../../../shared/component/RegistryList/RegistryList';
import type { DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';

interface Row { _id:string;description:string;missionTitle?:string;status:string;dueAt?:string }

export async function getPage(page:number):Promise<DryQueryResultsInterface<RegistryItem>> {
    const result = await dryMain.getAll<DryQueryResultsInterface<Row>>({page,pageSize:20},'/recommendations');
    return {meta:result.meta,data:result.data.map(item => ({_id:item._id,title:item.description,detail:item.missionTitle,label:item.status.replaceAll("_"," ") + (item.dueAt ? " ? "+new Date(item.dueAt).toLocaleDateString("fr-FR") : "")}))};
}
