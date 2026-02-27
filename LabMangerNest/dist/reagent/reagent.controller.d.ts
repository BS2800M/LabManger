import { ReagentService } from './reagent.service';
import { ReagentDto } from './reagent.dto';
import { SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
export declare class ReagentController {
    private readonly reagentService;
    constructor(reagentService: ReagentService);
    add(body: ReagentDto['requestAdd'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            specifications: string;
            price: number;
            storageCondition: string;
            manufacturer: string;
            note: string;
            warnNumber: number;
            warnDays: number;
            createTime: Date;
            teamId: number;
            status: number;
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
    show(query: ReagentDto['requestShow'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            specifications: string;
            price: number;
            storageCondition: string;
            manufacturer: string;
            note: string;
            warnNumber: number;
            warnDays: number;
            createTime: Date;
            teamId: number;
            status: number;
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
    update(body: ReagentDto['requestUpdate'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            specifications: string;
            price: number;
            storageCondition: string;
            manufacturer: string;
            note: string;
            warnNumber: number;
            warnDays: number;
            createTime: Date;
            teamId: number;
            status: number;
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
    del(body: ReagentDto['requestDel'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            specifications: string;
            price: number;
            storageCondition: string;
            manufacturer: string;
            note: string;
            warnNumber: number;
            warnDays: number;
            createTime: Date;
            teamId: number;
            status: number;
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
    showAll(session: ISessionUser): Promise<{
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
