import type { DryQueryResultsInterface } from './dry-query-results.interface';

export interface Mission {
    _id: string;
    title: string;
    progress?:number;
    createdAt?:string;
    entityName?:string;
    reference?: string;
    scope?: string;
    status: string;
    version: number;
    workPermissions?: {
        readTimeline?:boolean; readProgram?:boolean; writeProgram?:boolean; readFindings?:boolean;
        readReport?:boolean; readContradictions?:boolean; readRecommendations?:boolean; createFinding?:boolean;
    };
}

export interface Report { summary: string; conclusions: string; status: string; version: number; mayApprove: boolean; updatedAt?:string }

export type Page = DryQueryResultsInterface<Mission>;
