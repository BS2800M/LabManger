"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryZod = void 0;
const zod_1 = require("zod");
const api_request_dto_1 = require("../common/dtos/api-request.dto");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const responseShowData = zod_1.z.object({
    id: zod_1.z.number(),
    reagent: zod_1.z.object({ id: zod_1.z.number(), name: zod_1.z.string(), specifications: zod_1.z.string(), warnNumber: zod_1.z.number() }),
    lot: zod_1.z.object({ id: zod_1.z.number(), name: zod_1.z.string(), expirationDate: zod_1.z.coerce.date() }),
    teamId: zod_1.z.number(),
    number: zod_1.z.number(),
    status: zod_1.z.number(),
    warning: zod_1.z.string(),
});
const responseStatisticsData = zod_1.z.object({
    xAxisLabels: zod_1.z.array(zod_1.z.coerce.date()),
    dataSet: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        number: zod_1.z.array(zod_1.z.number()),
    })),
});
exports.InventoryZod = {
    requestShow: api_request_dto_1.ApiRequestZod.pageQuery.extend({
        name: zod_1.z.string().optional(),
    }),
    requestShowAll: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).optional(),
        pageSize: zod_1.z.coerce.number().min(1).max(9999999).optional(),
        name: zod_1.z.string().optional(),
    }),
    requestAuditAll: zod_1.z.object({}),
    requestStatistics: zod_1.z.object({
        reagentId: zod_1.z.coerce.number().min(1),
        lotId: zod_1.z.coerce.number().min(1).optional(),
        onlyLot: zod_1.z.coerce.boolean().optional(),
        startTime: zod_1.z.coerce.date(),
        endTime: zod_1.z.coerce.date(),
        intervalDay: zod_1.z.coerce.number().min(1),
    }),
    responseShow: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowData) }),
    responseShowAll: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowData) }),
    responseAuditAll: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.object({ message: zod_1.z.string().optional() }) }),
    responseStatistics: api_response_dto_1.ApiResponseZod.extend({ data: responseStatisticsData }),
};
//# sourceMappingURL=inventory.dto.js.map