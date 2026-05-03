import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { Status } from '../common/enums/enums';

const requestData = z.object({
    id: z.number().optional(),
    name: z.string(),
    phone: z.string().default(''),
    note: z.string().default(''),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]).default(Status.Enable),
});

const responseShowData = z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    note: z.string(),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
});

export const TeamZod = {
    requestAdd: requestData,
    requestShow: ApiRequestZod.searchQuery,
    requestUpdate: requestData,
    requestDel: z.object({
        id: z.number().min(1),
    }),
    responseAdd: ApiResponseZod.extend({ data: responseShowData }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseUpdate: ApiResponseZod.extend({ data: responseShowData }),
    responseDel: ApiResponseZod.extend({ data: responseShowData }),
} as const;

export type TeamDto = ZodToDto<typeof TeamZod>;
