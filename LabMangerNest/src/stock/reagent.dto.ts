import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';

const responseReagentData = z.object({
    id: z.number(),
    name: z.string(),
    di: z.string(),
    specifications: z.string(),
    price: z.number(),
    storageCondition: z.string(),
    manufacturer: z.string(),
    note: z.string(),
    warnNumber: z.number(),
    warnDays: z.number(),
    createTime: z.coerce.date(),
    teamId: z.number(),
    status: z.number(),
});

const responseShowAllData = z.object({
    id: z.number(),
    name: z.string(),
});

export const ReagentZod = {
    requestAdd: z.object({
        name: z.string(),
        di: z.string().default(''),
        specifications: z.string().default(''),
        price: z.number().default(0),
        storageCondition: z.string().default(''),
        manufacturer: z.string().default(''),
        note: z.string().default(''),
        warnNumber: z.number().default(0),
        warnDays: z.number().default(0),
        generateLot: z.boolean().default(false),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        name: z.string().optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        name: z.string(),
        di: z.string().default(''),
        specifications: z.string().default(''),
        price: z.number().default(0),
        storageCondition: z.string().default(''),
        manufacturer: z.string().default(''),
        note: z.string().default(''),
        warnNumber: z.number().default(0),
        warnDays: z.number().default(0),
        status: z.number(),
    }),
    requestDel: z.object({
        id: z.number().min(1),
    }),
    responseAdd: ApiResponseZod.extend({ data: responseReagentData }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseReagentData) }),
    responseUpdate: ApiResponseZod.extend({ data: responseReagentData }),
    responseDel: ApiResponseZod.extend({ data: responseReagentData }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowAllData) }),
} as const;

export type ReagentDto = ZodToDto<typeof ReagentZod>;
