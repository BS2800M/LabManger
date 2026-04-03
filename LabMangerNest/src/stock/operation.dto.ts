import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';

const inboundListItem = z.object({
    reagentId: z.number().min(1),
    lotId: z.number().min(1),
    number: z.number().default(0),
    note: z.string().default(''),
});

const outboundListItem = z.object({
    reagentId: z.number().min(1),
    lotId: z.number().min(1),
    number: z.number().default(0),
    note: z.string().default(''),
});



const responseShowData = z.object({
    batchId: z.number(),
    createTime: z.coerce.date(),
    reagent: z.object({ id: z.number(), name: z.string() }),
    lot: z.object({ id: z.number(), name: z.string() }),
    number: z.number(),
    detailData: z.array(z.object({ id: z.number(), barcodeNumber: z.string(), udi: z.string() })),
    note: z.string(),
    action: z.number(),
    status: z.number(),
    user: z.object({ id: z.number(), userName: z.string() }),
    userNameSnapshot: z.string(),
    reagentNameSnapshot: z.string(),
    lotNameSnapshot: z.string(),
});

export const OperationZod = {
    requestFastInbound: z.object({
        udi: z.string(),
        note: z.string().default(''),
    }),
    requestInbound: z.object({
        inboundList: z.array(inboundListItem).min(1),
    }),
    requestFastOutbound: z.object({
        useUdi: z.boolean().default(false),
        udi: z.string().default(''),
        barcodeNumber: z.string().default(''),
        note: z.string().default(''),
    }),
    requestOutbound: z.object({
        outboundList: z.array(outboundListItem).min(1),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        reagentName: z.string().optional(),
        barcodeNumber: z.string().optional(),
        udi: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
    }),
    requestShowAll: z.object({
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(9999999).optional(),
        reagentName: z.string().optional(),
        barcodeNumber: z.string().optional(),
        udi: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
    }),
    requestDisable: z.object({
        batchId: z.number().min(1),
    }),
    responseFastInbound: ApiResponseZod.extend({ data: z.object({ status: z.number(), message: z.string() }) }),
    responseInbound: ApiResponseZod.extend({ data: z.object({ messages: z.array(z.string()) }) }),
    responseFastOutbound: ApiResponseZod.extend({ data: z.object({ status: z.number(), message: z.string() }) }),
    responseOutbound: ApiResponseZod.extend({ data: z.object({ messages: z.array(z.string()) }) }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseDisable: ApiResponseZod.extend({ data: z.object({ batchId: z.number() }) }),
} as const;

export type OperationDto = ZodToDto<typeof OperationZod>;
