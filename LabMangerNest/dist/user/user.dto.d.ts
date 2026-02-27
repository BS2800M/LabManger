import { z } from 'zod';
import { ZodToDto } from '../common/dtos/api-request.dto';
import { UserRole } from '../common/enums/enums';
export declare const UserZod: {
    readonly requestAdd: z.ZodObject<{
        userName: z.ZodString;
        passWord: z.ZodString;
        role: z.ZodEnum<typeof UserRole>;
        teamId: z.ZodNumber;
    }, z.core.$strip>;
    readonly requestShow: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        userName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly requestUpdate: z.ZodObject<{
        id: z.ZodNumber;
        userName: z.ZodString;
        passWord: z.ZodString;
        role: z.ZodEnum<typeof UserRole>;
        status: z.ZodNumber;
        teamId: z.ZodNumber;
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
            userName: z.ZodString;
            role: z.ZodEnum<typeof UserRole>;
            status: z.ZodNumber;
            teamId: z.ZodNumber;
            teamName: z.ZodOptional<z.ZodString>;
            passWord: z.ZodOptional<z.ZodString>;
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
            userName: z.ZodString;
            role: z.ZodEnum<typeof UserRole>;
            status: z.ZodNumber;
            teamId: z.ZodNumber;
            teamName: z.ZodOptional<z.ZodString>;
            passWord: z.ZodOptional<z.ZodString>;
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
            userName: z.ZodString;
            role: z.ZodEnum<typeof UserRole>;
            status: z.ZodNumber;
            teamId: z.ZodNumber;
            teamName: z.ZodOptional<z.ZodString>;
            passWord: z.ZodOptional<z.ZodString>;
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
            userName: z.ZodString;
            role: z.ZodEnum<typeof UserRole>;
            status: z.ZodNumber;
            teamId: z.ZodNumber;
            teamName: z.ZodOptional<z.ZodString>;
            passWord: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export type UserDto = ZodToDto<typeof UserZod>;
