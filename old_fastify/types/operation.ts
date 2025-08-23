export interface OutboundRequestBody {
    barcodenumber: string;
}

export interface SpecialOutboundRequestBody {
    outboundlist: Array<{
        reagentid: number;
        lotid: number;
        number: number;
    }>;
}

export interface OperationShowRequestQuery {
    reagentname: string;
    searchlater: string;
    searchearlier: string;
    barcodenumber: string;
    pagesize: number;
    page: number;
}

export interface TransformedShow {
    id: number;
    reagentid: number;
    lotid: number;
    reagentname: string;
    lotname: string;
    barcodenumber: string;
    operation_action: string;
    using: boolean;
    userid: number;
}

export interface OperationShowSearchParams {
    using: boolean;
    reagent: {
        teamid?: number;
        name?: {
            contains: string;
        };
    };
    barcodenumber?: {
        contains: string;
    };

    creation_time?: {
        gte?: string;
        lte?: string;
    };
}

export interface OperationDelRequestBody {
    id: number;
}

export interface InboundRequestBody {
    inboundlist: Array<{
        reagentid: number;
        lotid: number;
        number: number;
    }>;
} 