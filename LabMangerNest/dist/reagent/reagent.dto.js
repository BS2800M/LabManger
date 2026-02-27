"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReagentZod = void 0;
const zod_1 = require("zod");
const api_request_dto_1 = require("../common/dtos/api-request.dto");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const responseReagentData = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    specifications: zod_1.z.string(),
    price: zod_1.z.number(),
    storageCondition: zod_1.z.string(),
    manufacturer: zod_1.z.string(),
    note: zod_1.z.string(),
    warnNumber: zod_1.z.number(),
    warnDays: zod_1.z.number(),
    createTime: zod_1.z.coerce.date(),
    teamId: zod_1.z.number(),
    status: zod_1.z.number(),
});
const responseShowAllData = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
exports.ReagentZod = {
    requestAdd: zod_1.z.object({
        name: zod_1.z.string(),
        specifications: zod_1.z.string().default(''),
        price: zod_1.z.number().default(0),
        storageCondition: zod_1.z.string().default(''),
        manufacturer: zod_1.z.string().default(''),
        note: zod_1.z.string().default(''),
        warnNumber: zod_1.z.number().default(0),
        warnDays: zod_1.z.number().default(0),
        generateLot: zod_1.z.boolean().default(false),
    }),
    requestShow: api_request_dto_1.ApiRequestZod.pageQuery.extend({
        name: zod_1.z.string().optional(),
    }),
    requestUpdate: zod_1.z.object({
        id: zod_1.z.number().min(1),
        name: zod_1.z.string(),
        specifications: zod_1.z.string().default(''),
        price: zod_1.z.number().default(0),
        storageCondition: zod_1.z.string().default(''),
        manufacturer: zod_1.z.string().default(''),
        note: zod_1.z.string().default(''),
        warnNumber: zod_1.z.number().default(0),
        warnDays: zod_1.z.number().default(0),
        status: zod_1.z.number(),
    }),
    requestDel: zod_1.z.object({
        id: zod_1.z.number().min(1),
    }),
    responseAdd: api_response_dto_1.ApiResponseZod.extend({ data: responseReagentData }),
    responseShow: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseReagentData) }),
    responseUpdate: api_response_dto_1.ApiResponseZod.extend({ data: responseReagentData }),
    responseDel: api_response_dto_1.ApiResponseZod.extend({ data: responseReagentData }),
    responseShowAll: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowAllData) }),
};
//# sourceMappingURL=reagent.dto.js.map