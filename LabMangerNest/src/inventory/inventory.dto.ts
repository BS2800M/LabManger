import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';

const responseShowData = z.object({
    id: z.number(),
    reagent: z.object({ id: z.number(), name: z.string(), specifications: z.string(), warnNumber: z.number() }),
    lot: z.object({ id: z.number(), name: z.string(), expirationDate: z.coerce.date() }),
    teamId: z.number(),
    number: z.number(),
    status: z.number(),
    warning: z.string(),
});

const responseStatisticsData = z.object({
    xAxisLabels: z.array(z.coerce.date()),
    dataSet: z.array(z.object({
        name: z.string(),
        number: z.array(z.number()),
    })),
});

export const InventoryZod = {
    requestShow: ApiRequestZod.pageQuery.extend({
        name: z.string().optional(),
    }),
    requestShowAll: z.object({
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(9999999).optional(),
        name: z.string().optional(),
    }),
    requestAuditAll: z.object({}),
    requestStatistics: z.object({
        reagentId: z.coerce.number().min(1),
        lotId: z.coerce.number().min(1).optional(),
        onlyLot: z.coerce.boolean().optional(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
        intervalDay: z.coerce.number().min(1),
    }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseAuditAll: ApiResponseZod.extend({data:z.object({message:z.string().optional()})}),
    responseStatistics: ApiResponseZod.extend({ data: responseStatisticsData }),
} as const;

export type InventoryDto = ZodToDto<typeof InventoryZod>;
