import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { Status } from '../common/enums/enums';

const responseLotData = z.object({
    id: z.number(),
    name: z.string(),
    reagentId: z.number(),
    expirationDate: z.coerce.date(),
    warnDays: z.number(),
    warningDate: z.coerce.date(),
    teamId: z.number(),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
});

const responseShowAllData = z.object({
    id: z.number(),
    name: z.string(),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
});

export const LotZod = {
    requestAdd: z.object({
        name: z.string(),
        reagentId: z.number().min(1),
        expirationDate: z.coerce.date(),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        name: z.string().optional(),
        reagentId: z.coerce.number().min(1),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        name: z.string(),
        reagentId: z.number().min(1),
        expirationDate: z.coerce.date(),
        warnDays: z.number().default(0),
        status: z.enum(Object.values(Status) as [Status, ...Status[]]),
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
