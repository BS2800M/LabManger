import { OperationService } from './operation.service';
import { OperationDto } from './operation.dto';
import { SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
export declare class OperationController {
    private readonly operationService;
    constructor(operationService: OperationService);
    inbound(body: OperationDto['requestInbound'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            messages: string[];
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
    outbound(body: OperationDto['requestOutbound'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            status: number;
            message: string;
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
    specialOutbound(body: OperationDto['requestSpecialOutbound'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            messages: string[];
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
    show(query: OperationDto['requestShow'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            createTime: Date;
            reagent: {
                id: number;
                name: string;
            };
            lot: {
                id: number;
                name: string;
            };
            note: string;
            barcodeNumber: string;
            user: {
                id: number;
                userName: string;
            };
            action: number;
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
    showAll(query: OperationDto['requestShowAll'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            createTime: Date;
            reagent: {
                id: number;
                name: string;
            };
            lot: {
                id: number;
                name: string;
            };
            note: string;
            barcodeNumber: string;
            user: {
                id: number;
                userName: string;
            };
            action: number;
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
    update(body: OperationDto['requestUpdate'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            lotId: number;
            userId: number;
            teamId: number;
            createTime: Date;
            barcodeNumber: string;
            action: number;
            note: string;
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
    del(body: OperationDto['requestDel'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            lotId: number;
            userId: number;
            teamId: number;
            createTime: Date;
            barcodeNumber: string;
            action: number;
            note: string;
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
}
