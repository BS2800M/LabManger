"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamZod = void 0;
const zod_1 = require("zod");
const api_request_dto_1 = require("../common/dtos/api-request.dto");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const requestData = zod_1.z.object({
    id: zod_1.z.number().optional(),
    name: zod_1.z.string(),
    phone: zod_1.z.string().default(''),
    note: zod_1.z.string().default(''),
    status: zod_1.z.number().default(0),
});
const responseShowData = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    phone: zod_1.z.string(),
    note: zod_1.z.string(),
    status: zod_1.z.number(),
});
exports.TeamZod = {
    requestAdd: requestData,
    requestShow: api_request_dto_1.ApiRequestZod.searchQuery,
    requestUpdate: requestData,
    requestDel: zod_1.z.object({
        id: zod_1.z.number().min(1),
    }),
    responseAdd: api_response_dto_1.ApiResponseZod.extend({ data: responseShowData }),
    responseShow: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseShowData) }),
    responseUpdate: api_response_dto_1.ApiResponseZod.extend({ data: responseShowData }),
    responseDel: api_response_dto_1.ApiResponseZod.extend({ data: responseShowData }),
};
//# sourceMappingURL=team.dto.js.map