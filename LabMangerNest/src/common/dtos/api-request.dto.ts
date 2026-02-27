import { z } from 'zod';

export type ZodToDto<T extends Record<string, z.ZodType<any>>> = {
  [i in keyof T as `${i & string}`]: z.infer<T[i]>
};

const pageNumber = z.coerce.number().min(1).optional();
const pageSizeNumber = z.coerce.number().min(1).max(100).optional();

export const ApiRequestZod = {
  pageQuery: z.object({
    page: pageNumber,
    pageSize: pageSizeNumber,
  }),

  searchQuery: z.object({
    page: pageNumber,
    pageSize: pageSizeNumber,
    name: z.string().optional(),
  }),

  timeRange: z.object({
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
  }),

  timeRangeQuery: z.object({
    page: pageNumber,
    pageSize: pageSizeNumber,
    name: z.string().optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
  }),
};

export type PageQueryDto = z.infer<typeof ApiRequestZod.pageQuery>;
export type SearchQueryDto = z.infer<typeof ApiRequestZod.searchQuery>;
export type TimeRangeDto = z.infer<typeof ApiRequestZod.timeRange>;
export type TimeRangeQueryDto = z.infer<typeof ApiRequestZod.timeRangeQuery>;
