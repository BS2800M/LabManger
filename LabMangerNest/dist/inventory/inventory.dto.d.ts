import { z } from 'zod';
import { ZodToDto } from '../common/dtos/api-request.dto';
export declare const InventoryZod: {
    readonly requestShow: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly requestShowAll: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly requestAuditAll: z.ZodObject<{}, z.core.$strip>;
    readonly requestStatistics: z.ZodObject<{
        reagentId: z.ZodCoercedNumber<unknown>;
        lotId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        onlyLot: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
        startTime: z.ZodCoercedDate<unknown>;
        endTime: z.ZodCoercedDate<unknown>;
        intervalDay: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    readonly responseShow: z.ZodObject<{
        success: z.ZodBoolean;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
        meta: z.ZodOptional<z.ZodObject<{
            page: z.ZodNumber;
            pageSize: z.ZodNumber;
            total: z.ZodNumber;
            totalPage: z.ZodNumber;
            timestamp: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        data: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            reagent: z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodString;
                specifications: z.ZodString;
                warnNumber: z.ZodNumber;
            }, z.core.$strip>;
            lot: z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodString;
                expirationDate: z.ZodCoercedDate<unknown>;
            }, z.core.$strip>;
            teamId: z.ZodNumber;
            number: z.ZodNumber;
            status: z.ZodNumber;
            warning: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly responseShowAll: z.ZodObject<{
        success: z.ZodBoolean;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
        meta: z.ZodOptional<z.ZodObject<{
            page: z.ZodNumber;
            pageSize: z.ZodNumber;
            total: z.ZodNumber;
            totalPage: z.ZodNumber;
            timestamp: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        data: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            reagent: z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodString;
                specifications: z.ZodString;
                warnNumber: z.ZodNumber;
            }, z.core.$strip>;
            lot: z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodString;
                expirationDate: z.ZodCoercedDate<unknown>;
            }, z.core.$strip>;
            teamId: z.ZodNumber;
            number: z.ZodNumber;
            status: z.ZodNumber;
            warning: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly responseAuditAll: z.ZodObject<{
        success: z.ZodBoolean;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
        meta: z.ZodOptional<z.ZodObject<{
            page: z.ZodNumber;
            pageSize: z.ZodNumber;
            total: z.ZodNumber;
            totalPage: z.ZodNumber;
            timestamp: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        data: z.ZodObject<{
            message: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    readonly responseStatistics: z.ZodObject<{
        success: z.ZodBoolean;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
        meta: z.ZodOptional<z.ZodObject<{
            page: z.ZodNumber;
            pageSize: z.ZodNumber;
            total: z.ZodNumber;
            totalPage: z.ZodNumber;
            timestamp: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        data: z.ZodObject<{
            xAxisLabels: z.ZodArray<z.ZodCoercedDate<unknown>>;
            dataSet: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                number: z.ZodArray<z.ZodNumber>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export type InventoryDto = ZodToDto<typeof InventoryZod>;
