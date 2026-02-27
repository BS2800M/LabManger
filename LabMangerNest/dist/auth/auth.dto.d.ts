import { z } from 'zod';
import { ZodToDto } from 'src/common/dtos/api-request.dto';
export declare const AuthZod: {
    readonly requestSignin: z.ZodObject<{
        userName: z.ZodString;
        passWord: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly requestSignout: z.ZodObject<{
        sessionId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly responseSignin: z.ZodObject<{
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
            sessionId: z.ZodString;
            userName: z.ZodString;
            teamName: z.ZodString;
            role: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    readonly responseSignout: z.ZodObject<{
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
            status: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export type AuthDto = ZodToDto<typeof AuthZod>;
