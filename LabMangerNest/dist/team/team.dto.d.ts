import { z } from 'zod';
import { ZodToDto } from '../common/dtos/api-request.dto';
export declare const TeamZod: {
    readonly requestAdd: z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        name: z.ZodString;
        phone: z.ZodDefault<z.ZodString>;
        note: z.ZodDefault<z.ZodString>;
        status: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    readonly requestShow: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly requestUpdate: z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        name: z.ZodString;
        phone: z.ZodDefault<z.ZodString>;
        note: z.ZodDefault<z.ZodString>;
        status: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    readonly requestDel: z.ZodObject<{
        id: z.ZodNumber;
    }, z.core.$strip>;
    readonly responseAdd: z.ZodObject<{
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
            id: z.ZodNumber;
            name: z.ZodString;
            phone: z.ZodString;
            note: z.ZodString;
            status: z.ZodNumber;
        }, z.core.$strip>;
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
            name: z.ZodString;
            phone: z.ZodString;
            note: z.ZodString;
            status: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly responseUpdate: z.ZodObject<{
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
            id: z.ZodNumber;
            name: z.ZodString;
            phone: z.ZodString;
            note: z.ZodString;
            status: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    readonly responseDel: z.ZodObject<{
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
            id: z.ZodNumber;
            name: z.ZodString;
            phone: z.ZodString;
            note: z.ZodString;
            status: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export type TeamDto = ZodToDto<typeof TeamZod>;
