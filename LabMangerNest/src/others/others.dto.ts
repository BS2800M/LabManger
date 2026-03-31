import { z } from 'zod';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { ZodToDto } from '../common/dtos/api-request.dto';

const responseTimeData = z.object({
    unixMs: z.number().int(),
});

export const OthersZod = {
    requestTime: z.object({}),
    responseTime: ApiResponseZod.extend({ data: responseTimeData }),
} as const;

export type OthersDto = ZodToDto<typeof OthersZod>;
