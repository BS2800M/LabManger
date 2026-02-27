import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';

const responseLotData = z.object({
    id: z.number(),
    name: z.string(),
    reagentId: z.number(),
    expirationDate: z.coerce.date(),
    teamId: z.number(),
    status: z.number(),
    reagentName: z.string().optional(),
});

const responseShowAllData = z.object({
    id: z.number(),
    name: z.string(),
});

export const LotZod = {
    requestAdd: z.object({
        name: z.string(),
        reagentId: z.number().min(1),
        expirationDate: z.coerce.date(),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        name: z.string().optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        name: z.string(),
        reagentId: z.number().min(1),
        expirationDate: z.coerce.date(),
        status: z.number(),
    }),
    requestDel: z.object({
        id: z.number().min(1),
    }),
    requestShowAll: z.object({
        reagentId: z.coerce.number().min(1).optional(),
    }),
    responseAdd: ApiResponseZod.extend({ data: responseLotData }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseLotData) }),
    responseUpdate: ApiResponseZod.extend({ data: responseLotData }),
    responseDel: ApiResponseZod.extend({ data: responseLotData }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowAllData) }),
} as const;

export type LotDto = ZodToDto<typeof LotZod>;
