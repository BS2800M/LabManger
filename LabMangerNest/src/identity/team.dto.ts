import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from 'src/common/dtos/api-response.dto';

const requestData = z.object({
    id: z.number().optional(),
    name: z.string(),
    phone: z.string().default(''),
    note: z.string().default(''),
    status: z.number().default(0),
});

const responseShowData = z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    note: z.string(),
    status: z.number(),
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
