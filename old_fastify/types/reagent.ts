export interface ReagentShowRequestQuery {
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
    warn_days: number;
    using: boolean;
    manufacturer: string;
    note: string;
}

export interface ReagentDelRequestBody {
    id: number;
}



export interface ReagentAddRequestBody {
    name: string;
    specifications: string;
    warn_number: number;
    price: number;
    storage_condition: string;
    warn_days: number;
    using: boolean;
    generate_lot: boolean;
    manufacturer: string;
    note: string;
} 