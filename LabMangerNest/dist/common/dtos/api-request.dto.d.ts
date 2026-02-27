import { z } from 'zod';
export type ZodToDto<T extends Record<string, z.ZodType<any>>> = {
    [i in keyof T as `${i & string}`]: z.infer<T[i]>;
};
export declare const ApiRequestZod: {
    pageQuery: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
    searchQuery: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    timeRange: z.ZodObject<{
        startTime: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        endTime: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>;
    timeRangeQuery: z.ZodObject<{
        page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        pageSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        name: z.ZodOptional<z.ZodString>;
        startTime: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        endTime: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>;
};
export type PageQueryDto = z.infer<typeof ApiRequestZod.pageQuery>;
export type SearchQueryDto = z.infer<typeof ApiRequestZod.searchQuery>;
export type TimeRangeDto = z.infer<typeof ApiRequestZod.timeRange>;
export type TimeRangeQueryDto = z.infer<typeof ApiRequestZod.timeRangeQuery>;
