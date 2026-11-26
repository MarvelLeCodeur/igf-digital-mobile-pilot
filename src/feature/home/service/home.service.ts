import type { DryQueryResultInterface } from '../../../dry-core/dry-model/dry-interface';
import { dryMain } from '../../../dry-core/dry-service/dry-main.service';

export interface HomeTotals {
    totals:{total:number;closed:number;recommendations:number;resolved:number;openRisks:number};
    statuses:Record<string,number>;
    permissions:{recommendations:boolean;reports:boolean};
    approvalsPending?:number;
}

export async function getHomeTotals() {
    const result = await dryMain.getAll<DryQueryResultInterface<HomeTotals>>({entityPageSize:1},'/analytics');
    if (!result.data.permissions.reports) return result;
    // L’onglet Approbations liste les rapports. Son compteur utilise la même source et le même statut.
    const approvals = await dryMain.getAll<{meta:{total:number}}>({page:1,pageSize:1,status:'EN_REVUE'},'/reports');
    return {...result,data:{...result.data,approvalsPending:approvals.meta.total}};
}
