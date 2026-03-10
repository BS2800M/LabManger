import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';

const responseSensorRecordData = z.object({
    id: z.number(),
    locationId: z.number(),
    location: z.object({id:z.number(),name:z.string()}),
    team: z.object({id:z.number(),name:z.string()}),
    createTime: z.coerce.date(),
    temperature: z.number(),
    humidity: z.number(),
});

const sensorRecordItem = z.object({
    locationId: z.number().min(1),
    temperature: z.number(),
    humidity: z.number(),
    createTime: z.coerce.date().default(new Date()),
});

export const SensorRecordZod = {
    requestAdd: z.object({
        data: z.array(sensorRecordItem).min(1),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        locationName: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        temperature: z.number(),
        humidity: z.number(),
        locationId: z.number().min(1),
        createTime: z.coerce.date(),
    }),
    requestDel: z.object({
        id: z.number().min(1),
    }),
    requestShowAll: z.object({
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(9999999).optional(),
        locationName: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
    }),
    responseAdd: ApiResponseZod.extend({ data: z.string() }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseSensorRecordData) }),
    responseUpdate: ApiResponseZod.extend({ data: responseSensorRecordData }),
    responseDel: ApiResponseZod.extend({ data: responseSensorRecordData }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseSensorRecordData) }),
} as const;

export type SensorRecordDto = ZodToDto<typeof SensorRecordZod>;
