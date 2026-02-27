import { z } from 'zod';
export interface ApiMeta {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPage?: number;
    timestamp?: string;
}
export interface ApiError {
    code: string;
    message: string;
    details?: any;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ApiMeta;
}
export declare const ApiResponseZod: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
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
}, z.core.$strip>;
export declare const HttpStatus: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_ERROR: 500;
};
export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
