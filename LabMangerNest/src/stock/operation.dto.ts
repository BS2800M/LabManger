import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { OperationAction, Status } from '../common/enums/enums';

const inboundListItem = z.object({
    reagentId: z.number().min(1),
    lotId: z.number().min(1),
    number: z.number().default(0),
    note: z.string().default(''),
});

const outboundListItem = z.object({
    reagentId: z.number(),
    lotId: z.number().min(1),
    number: z.number().default(0),
    note: z.string().default(''),
});



const responseShowData = z.object({
    id: z.number(),
    createdAt: z.coerce.date(),
    reagentId: z.number(),
    lotId: z.number(),
    actionNum: z.number(),
    note: z.string(),
    action: z.enum(Object.values(OperationAction) as [OperationAction, ...OperationAction[]]),
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
    user: z.object({ id: z.number(), userName: z.string() }),
    reagentNameSnapshot: z.string(),
    lotNameSnapshot: z.string(),
    userNameSnapshot: z.string(),
});
const responseShowDetailData = z.object({
    id: z.number(),
    barcodeNumber: z.string(),
    udi:z.string(),
    batch: z.object({
        reagentNameSnapshot: z.string(),
        lotNameSnapshot: z.string(),
     })
});

const operationResult = z.object({
    message: z.string(),
    isSuccess: z.boolean(),
});
const barcodeData = z.object({
    barcodeNumber: z.string(),
    reagentName: z.string(),
    lotName: z.string(),
});
export const OperationZod = {
    requestFastInbound: z.object({
        udi: z.string(),
        note: z.string().default(''),
        allowExpiringInbound: z.boolean().default(false),
    }),
    requestInbound: z.object({
        allowExpiringInbound: z.boolean().default(false),
        inboundList: z.array(inboundListItem),
    }),
    requestFastOutbound: z.object({
        useUdi: z.boolean().default(false),
        udi: z.string().default(''),
        barcodeNumber: z.string().default(''),
        note: z.string().default(''),
    }),
    requestOutbound: z.object({
        outboundList: z.array(outboundListItem),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        reagentName: z.string().optional(),
        barcodeNumber: z.string().optional(),
        udi: z.string().optional(),
        startTime: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.date().optional()),
        endTime: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.date().optional())
    }),
    requestShowDetail: ApiRequestZod.pageQuery.extend({
        batchId: z.coerce.number().min(1),
        udi: z.string().optional(),
        barcodeNumber: z.string().optional(),
    }),
    requestShowAll: z.object({
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(9999999).optional(),
        reagentName: z.string().optional(),
        barcodeNumber: z.string().optional(),
        udi: z.string().optional(),
        startTime: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.date().optional()),
        endTime: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.date().optional()),
    }),
    requestDisable: z.object({
        batchId: z.number().min(1),
    }),
    responseFastInbound: ApiResponseZod.extend({
        data: z.object({ status:z.boolean, message: z.string() }),
    }),
    responseInbound: ApiResponseZod.extend({ data: z.array(operationResult) , barcodeData: z.array(barcodeData) }),
    responseFastOutbound: ApiResponseZod.extend({
        data: z.object({ status: z.boolean, message: z.string() }),
    }),
    responseOutbound: ApiResponseZod.extend({ data: z.array(operationResult) }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseShowDetail: ApiResponseZod.extend({ data: z.array(responseShowDetailData) }),
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowData) }),
    responseDisable: ApiResponseZod.extend({ data: z.object({ batchId: z.number() }) }),
} as const;

export type OperationDto = ZodToDto<typeof OperationZod>;
