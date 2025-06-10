export interface LotShowRequestQuery {
    reagentname: string;
    page: number;
    pagesize: number;
}

export interface LotSearchParams {
    using: boolean;
    reagent?: {
        name: {
            contains: string;
        };
    };
}





export interface LotUpdateRequestBody {
    id: number;
    name: string;
    reagentid: number;
    expiration_date: string;
    using: boolean;
}

export interface LotDelRequestBody {
    id: number;
}









export interface LotShowAllRequestQuery {
    reagentid: number;
}









export interface TransformedShow {
    id: number;
    name: string;
    expiration_date: Date;
    creation_time: Date;
    reagentid: number;
    reagentname: string;
    using: boolean;
    reagent?:any
}

export interface LotAddRequestBody {
    name: string;
    reagentid: number;
    expiration_date: string;
    using: boolean;
    warn_days: number;
} 