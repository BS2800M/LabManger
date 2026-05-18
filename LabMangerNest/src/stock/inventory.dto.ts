import { number, z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { Status } from '../common/enums/enums';
import { warn } from 'node:console';

const queryBoolean = z.preprocess(
    (value) => (value === 'true' ? true : value === 'false' ? false : value),
    z.boolean(),
);

const reagentInventoryRow = z.object({
    id: z.number(),
    name: z.string(),
    specifications: z.string(),
    number: z.number(),
    warnNumber: z.number(),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
    updatedAt: z.coerce.date().nullable(),
});

const lotInventoryRow = z.object({
    id: z.number(),
    name: z.string(),
    reagent:z.object({ id: z.number(), name: z.string(),number: z.number(),warnNumber: z.number() }),
    expirationDate: z.coerce.date(),
    warnDays: z.number(),
    warningDate: z.coerce.date(),
    number: z.number(),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
    updatedAt: z.coerce.date().nullable(),
});

export const InventoryZod = {
    requestShowReagent: ApiRequestZod.pageQuery.extend({
        name: z.string().optional(),
        lowStockOnly: queryBoolean.optional(),
    }),
    requestShowLot: ApiRequestZod.pageQuery.extend({
        lot: z.string().optional(),
        reagentId: z.coerce.number().min(1),
        expiredOnly: queryBoolean.optional(),
    }),
    requestShowAll: z.object({
        lot: z.string().optional(),
        page: z.coerce.number().min(1).default(1),
        pageSize: z.coerce.number().min(1).max(999999)
    }),
    responseShowReagent: ApiResponseZod.extend({ data: z.array(reagentInventoryRow) }),
    responseShowLot: ApiResponseZod.extend({ data: z.array(lotInventoryRow) }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(lotInventoryRow) }), 
} as const;

export type InventoryDto = ZodToDto<typeof InventoryZod>;
