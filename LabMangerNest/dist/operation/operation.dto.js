"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationZod = void 0;
const zod_1 = require("zod");
const api_request_dto_1 = require("../common/dtos/api-request.dto");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const enums_1 = require("../common/enums/enums");
const inboundListItem = zod_1.z.object({
    reagentId: zod_1.z.number().min(1),
    lotId: zod_1.z.number().min(1),
    number: zod_1.z.number().default(0),
    note: zod_1.z.string().default(''),
});
const outboundListItem = zod_1.z.object({
    reagentId: zod_1.z.number().min(1),
    lotId: zod_1.z.number().min(1),
    number: zod_1.z.number().default(0),
    note: zod_1.z.string().default(''),
});
const responseShowData = zod_1.z.object({
    id: zod_1.z.number(),
    createTime: zod_1.z.coerce.date(),
    reagent: zod_1.z.object({ id: zod_1.z.number(), name: zod_1.z.string() }),
    lot: zod_1.z.object({ id: zod_1.z.number(), name: zod_1.z.string() }),
    note: zod_1.z.string(),
    barcodeNumber: zod_1.z.string(),
    user: zod_1.z.object({ id: zod_1.z.number(), userName: zod_1.z.string() }),
    action: zod_1.z.number(),
});
const responseOperationData = zod_1.z.object({
    id: zod_1.z.number(),
    lotId: zod_1.z.number(),
    userId: zod_1.z.number(),
    teamId: zod_1.z.number(),
    createTime: zod_1.z.coerce.date(),
    barcodeNumber: zod_1.z.string(),
    action: zod_1.z.number(),
    note: zod_1.z.string(),
    status: zod_1.z.number(),
});
exports.OperationZod = {
    requestInbound: zod_1.z.object({
        inboundList: zod_1.z.array(inboundListItem).min(1),
    }),
    requestOutbound: zod_1.z.object({
        barcodeNumber: zod_1.z.string(),
    }),
    requestSpecialOutbound: zod_1.z.object({
        outboundList: zod_1.z.array(outboundListItem).min(1),
    }),
    requestShow: api_request_dto_1.ApiRequestZod.pageQuery.extend({
        reagentName: zod_1.z.string().optional(),
        barcodeNumber: zod_1.z.string().optional(),
        startTime: zod_1.z.coerce.date().optional(),
        endTime: zod_1.z.coerce.date().optional(),
    }),
    requestShowAll: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).optional(),
        pageSize: zod_1.z.coerce.number().min(1).max(9999999).optional(),
        reagentName: zod_1.z.string().optional(),
        barcodeNumber: zod_1.z.string().optional(),
        startTime: zod_1.z.coerce.date().optional(),
        endTime: zod_1.z.coerce.date().optional(),
    }),
    requestUpdate: zod_1.z.object({
        id: zod_1.z.number().min(1),
        reagentId: zod_1.z.number().min(1),
        lotId: zod_1.z.number().min(1),
        createTime: zod_1.z.coerce.date(),
        action: zod_1.z.enum(enums_1.OperationAction),
        note: zod_1.z.string().default(''),
        barcodeNumber: zod_1.z.string().default(''),
    }),
    requestDel: zod_1.z.object({
        id: zod_1.z.number().min(1),
    }),
    responseInbound: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.object({ messages: zod_1.z.array(zod_1.z.string()) }) }),
    responseOutbound: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.object({ status: zod_1.z.number(), message: zod_1.z.string() }) }),
    responseSpecialOutbound: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.object({ messages: zod_1.z.array(zod_1.z.string()) }) }),
    responseShow: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowData) }),
    responseShowAll: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowData) }),
    responseUpdate: api_response_dto_1.ApiResponseZod.extend({ data: responseOperationData }),
    responseDel: api_response_dto_1.ApiResponseZod.extend({ data: responseOperationData }),
};
//# sourceMappingURL=operation.dto.js.map