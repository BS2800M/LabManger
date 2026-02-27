import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { OperationAction } from '../common/enums/enums';

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
    id: z.number(),
    createTime: z.coerce.date(),
    reagent: z.object({ id: z.number(), name: z.string() }),
    lot: z.object({ id: z.number(), name: z.string() }),
    note: z.string(),
    barcodeNumber: z.string(),
    user: z.object({ id: z.number(), userName: z.string() }),
    action: z.number(),
});

const responseOperationData = z.object({
    id: z.number(),
    lotId: z.number(),
    userId: z.number(),
    teamId: z.number(),
    createTime: z.coerce.date(),
    barcodeNumber: z.string(),
    action: z.number(),
    note: z.string(),
    status: z.number(),
});

export const OperationZod = {
    requestInbound: z.object({
        inboundList: z.array(inboundListItem).min(1),
    }),
    requestOutbound: z.object({
        barcodeNumber: z.string(),
    }),
    requestSpecialOutbound: z.object({
        outboundList: z.array(outboundListItem).min(1),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        reagentName: z.string().optional(),
        barcodeNumber: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
    }),
    requestShowAll: z.object({
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(9999999).optional(),
        reagentName: z.string().optional(),
        barcodeNumber: z.string().optional(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        reagentId: z.number().min(1),
        lotId: z.number().min(1),
        createTime: z.coerce.date(),
        action: z.enum(OperationAction),
        note: z.string().default(''),
        barcodeNumber: z.string().default(''),
    }),
    requestDel: z.object({
        id: z.number().min(1),
    }),
    responseInbound: ApiResponseZod.extend({ data: z.object({ messages: z.array(z.string()) }) }),
    responseOutbound: ApiResponseZod.extend({ data: z.object({ status: z.number(), message: z.string() }) }),
    responseSpecialOutbound: ApiResponseZod.extend({ data: z.object({ messages: z.array(z.string()) }) }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseUpdate: ApiResponseZod.extend({ data: responseOperationData }),
    responseDel: ApiResponseZod.extend({ data: responseOperationData }),
} as const;

export type OperationDto = ZodToDto<typeof OperationZod>;
