import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';

const queryBoolean = z.preprocess(
    (value) => (value === 'true' ? true : value === 'false' ? false : value),
    z.boolean(),
);



const inventoryTreeRow: any = z.lazy(() =>
    z.object({
        id: z.string(),
        nodeType: z.enum(['reagent', 'lot']),
        reagentId: z.number(),
        lotId: z.number().nullable(),
        reagentName: z.string(),
        lotName: z.string(),
        name: z.string(),
        number: z.number(),
        specifications: z.string(),
        lotExpirationDate: z.coerce.date().nullable(),
        warnNumber: z.number(),
        warn: z.number(),
        status: z.number(),
        children: z.array(inventoryTreeRow).optional(),
    }),
);

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
        onlyLot: queryBoolean.optional(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
        intervalDay: z.coerce.number().min(1),
    }),
    responseShow: ApiResponseZod.extend({ data: z.array(inventoryTreeRow) }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(inventoryTreeRow) }),
    responseAuditAll: ApiResponseZod.extend({data:z.object({message:z.string().optional()})}),
    responseStatistics: ApiResponseZod.extend({ data: responseStatisticsData }),
} as const;

export type InventoryDto = ZodToDto<typeof InventoryZod>;
