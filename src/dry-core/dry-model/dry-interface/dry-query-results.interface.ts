export interface DryQueryResultsInterface<T> {
    data:T[];
    meta:{page:number;totalPages:number;total?:number};
}
