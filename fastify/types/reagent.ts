export interface ReagentShowRequestQuery {
    teamid: number;
    name: string;
    page: number;
    pagesize: number;
}

export interface ReagentSearchParams {
    using: boolean;
    name?: {
        contains: string;
    };
}

export interface ReagentUpdateRequestBody {
    id: number;
    name: string;
    specifications: string;
    warn_number: number;
    price: number;
    storage_condition: string;
    teamid: number;
    warn_days: number;
    using: boolean;
}

export interface ReagentDelRequestBody {
    id: number;
}

export interface ReagentShowAllRequestQuery {
    teamid: number;
}

export interface ReagentAddRequestBody {
    name: string;
    specifications: string;
    warn_number: number;
    price: number;
    storage_condition: string;
    teamid: number;
    warn_days: number;
    using: boolean;
    generate_lot: boolean;
} 