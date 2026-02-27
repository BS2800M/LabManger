"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotZod = void 0;
const zod_1 = require("zod");
const api_request_dto_1 = require("../common/dtos/api-request.dto");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const responseLotData = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    reagentId: zod_1.z.number(),
    expirationDate: zod_1.z.coerce.date(),
    teamId: zod_1.z.number(),
    status: zod_1.z.number(),
    reagentName: zod_1.z.string().optional(),
});
const responseShowAllData = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
exports.LotZod = {
    requestAdd: zod_1.z.object({
        name: zod_1.z.string(),
        reagentId: zod_1.z.number().min(1),
        expirationDate: zod_1.z.coerce.date(),
    }),
    requestShow: api_request_dto_1.ApiRequestZod.pageQuery.extend({
        name: zod_1.z.string().optional(),
    }),
    requestUpdate: zod_1.z.object({
        id: zod_1.z.number().min(1),
        name: zod_1.z.string(),
        reagentId: zod_1.z.number().min(1),
        expirationDate: zod_1.z.coerce.date(),
        status: zod_1.z.number(),
    }),
    requestDel: zod_1.z.object({
        id: zod_1.z.number().min(1),
    }),
    requestShowAll: zod_1.z.object({
        reagentId: zod_1.z.coerce.number().min(1).optional(),
    }),
    responseAdd: api_response_dto_1.ApiResponseZod.extend({ data: responseLotData }),
    responseShow: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseLotData) }),
    responseUpdate: api_response_dto_1.ApiResponseZod.extend({ data: responseLotData }),
    responseDel: api_response_dto_1.ApiResponseZod.extend({ data: responseLotData }),
    responseShowAll: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowAllData) }),
};
//# sourceMappingURL=lot.dto.js.map