import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { Status } from '../common/enums/enums';

const responseLocationData = z.object({
    id: z.number(),
    name: z.string(),
    note: z.string().optional(),
    team:z.object({
        id: z.number(),
        name: z.string(),
    }),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
    uploadIntervalMinutes: z.number().min(1),
    maxTemperature: z.number(),
    minTemperature: z.number(),
    maxHumidity: z.number(),
    minHumidity: z.number(),
    warningTemperature: z.boolean(),
    warningHumidity: z.boolean(),
    warningUploadTime: z.boolean(),
    lastUploadTime: z.date(),
    lastUploadTemperature: z.number(),
    lastUploadHumidity: z.number(),
});

export const LocationZod = {
    requestAdd: z.object({
        name: z.string(),
        note: z.string().optional(),
        uploadIntervalMinutes: z.number().min(10).max(1000),
        maxTemperature: z.number().min(-50),
        minTemperature: z.number().min(-50),
        maxHumidity: z.number().min(0),
        minHumidity: z.number().min(0),
        status: z.enum(Object.values(Status) as [Status, ...Status[]]).optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        name: z.string(),
        note: z.string().optional(),
        uploadIntervalMinutes: z.number().min(0),
        maxTemperature: z.number().min(-50),
        minTemperature: z.number().min(-50),
        maxHumidity: z.number().min(0),
        minHumidity: z.number().min(0),
        status: z.enum(Object.values(Status) as [Status, ...Status[]]).optional(),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        name: z.string().optional(),
    }),
    requestDel: z.object({
        id: z.number().min(1),
    }),
    responseAdd: ApiResponseZod.extend({ data: responseLocationData }),
    responseUpdate: ApiResponseZod.extend({ data: responseLocationData }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseLocationData) }),
    responseDel: ApiResponseZod.extend({ data: responseLocationData }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(z.object({id: z.number(), name: z.string()})) }),
} as const;

export type LocationDto = ZodToDto<typeof LocationZod>;
