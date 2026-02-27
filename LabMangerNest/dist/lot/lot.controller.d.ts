import { LotService } from './lot.service';
import { LotDto } from './lot.dto';
import { SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
export declare class LotController {
    private readonly lotService;
    constructor(lotService: LotService);
    add(body: LotDto['requestAdd'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            reagentId: number;
            expirationDate: Date;
            teamId: number;
            status: number;
            reagentName?: string;
        };
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    show(query: LotDto['requestShow'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            reagentId: number;
            expirationDate: Date;
            teamId: number;
            status: number;
            reagentName?: string;
        }[];
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    update(body: LotDto['requestUpdate'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            reagentId: number;
            expirationDate: Date;
            teamId: number;
            status: number;
            reagentName?: string;
        };
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    del(body: LotDto['requestDel'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            reagentId: number;
            expirationDate: Date;
            teamId: number;
            status: number;
            reagentName?: string;
        };
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    showAll(query: LotDto['requestShowAll'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
        }[];
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
}
