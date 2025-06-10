export interface InventoryQuery {
    teamid: number;
    page: number;
    pagesize: number;
    only_warn: boolean;
}

export interface InventoryWhere {
    reagent: {
        teamid: number;
    };
    using: boolean;
    inventory_number?: {
        lte: number;
    };
}



export interface TransformedInventoryShow {
    id:number,
    reagentid:number,
    lotid:number,
    reagentname?:string,
    lotname?:string,
    inventory_number:number,
    last_outbound_time:Date,
    lastweek_outbound_number:number,
    warn_number?:number,
    specifications?:string,
    warn_days?:number,
    reagent?:any,
    lot?:any,
} 
export interface InventoryAudit {
    reagentid:number,
    lotid:number
}