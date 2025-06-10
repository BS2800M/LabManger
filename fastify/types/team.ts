export interface TeamShowRequestQuery {
    name: string;
    page: number;
    pagesize: number;
}

export interface TeamSearchParams {
    using: boolean;
    name?: {
        contains: string;
    };
}

export interface TeamUpdateRequestBody {
    id: number;
    name: string;
    phone: string;
    note: string;
    using: boolean;
}

export interface TeamDelRequestBody {
    id: number;
}

export interface TeamAddRequestBody {
    name: string;
    phone: string;
    note: string;
    using: boolean;
} 