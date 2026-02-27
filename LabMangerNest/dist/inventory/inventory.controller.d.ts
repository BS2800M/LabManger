import { InventoryService } from './inventory.service';
import { InventoryDto } from './inventory.dto';
import { SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    show(dto: InventoryDto['requestShow'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            reagent: {
                id: number;
                name: string;
                specifications: string;
                warnNumber: number;
            };
            lot: {
                id: number;
                name: string;
                expirationDate: Date;
            };
            teamId: number;
            number: number;
            status: number;
            warning: string;
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
    showAll(dto: InventoryDto['requestShowAll'], session: ISessionUser): Promise<{
        success: boolean;
        data: {
            id: number;
            reagent: {
                id: number;
                name: string;
                specifications: string;
                warnNumber: number;
            };
            lot: {
                id: number;
                name: string;
                expirationDate: Date;
            };
            teamId: number;
            number: number;
            status: number;
            warning: string;
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
    auditAll(_dto: any, session: any): Promise<{
        success: boolean;
        data: {
            message?: string;
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
    statistics(dto: any, session: any): Promise<{
        success: boolean;
        data: {
            xAxisLabels: Date[];
            dataSet: {
                name: string;
                number: number[];
            }[];
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
