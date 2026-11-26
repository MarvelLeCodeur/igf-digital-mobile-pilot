import type { DryQueryResultInterface, DryQueryResultsInterface } from '../../../dry-core/dry-model/dry-interface';
import { dryMain } from '../../../dry-core/dry-service/dry-main.service';
import type { Mission, Page, Report } from '../../../dry-core/dry-model/dry-interface/mission.interface';

const missionPath = (id:string) => '/missions/' + encodeURIComponent(id);

export interface MissionEvent { _id:string; action:string; category:string; timestamp:string; reason?:string; previousStatus?:string; nextStatus?:string }

export const missionService = {
    timeline(id:string,page:number,category:string) {
        return dryMain.getAll<DryQueryResultsInterface<MissionEvent>>({page,pageSize:10,category},missionPath(id)+'/timeline');
    },
    list(page:number) {
        return dryMain.getAll<Page>({page,pageSize:20,status:'EN_REVUE'},'/missions');
    },
    async search(page:number,q:string,status:string):Promise<Page> {
        const result = await dryMain.getAll<{data:{missionId:string;title:string;reference?:string;status:string;version:number}[];meta:Page['meta']}>(
            {page,pageSize:20,q,status},'/reports',
        );
        return {meta:result.meta,data:result.data.map(item => ({...item,_id:item.missionId}))};
    },
    detail(id:string) {
        return dryMain.getById<DryQueryResultInterface<Mission>>(id,'/missions');
    },
    report(id:string) {
        return dryMain.getOne<DryQueryResultInterface<Report|null>>(missionPath(id)+'/report');
    },
    decideReport(id:string,decision:'approve'|'reject',input:{expectedVersion:number;reason:string}) {
        return dryMain.create<DryQueryResultInterface<Omit<Report,'mayApprove'>>>(input,missionPath(id)+'/report/'+decision);
    },
};
