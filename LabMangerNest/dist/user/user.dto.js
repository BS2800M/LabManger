"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZod = void 0;
const zod_1 = require("zod");
const api_request_dto_1 = require("../common/dtos/api-request.dto");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const enums_1 = require("../common/enums/enums");
const responseUserData = zod_1.z.object({
    id: zod_1.z.number(),
    userName: zod_1.z.string(),
    role: zod_1.z.enum(enums_1.UserRole),
    status: zod_1.z.number(),
    teamId: zod_1.z.number(),
    teamName: zod_1.z.string().optional(),
    passWord: zod_1.z.string().optional(),
});
exports.UserZod = {
    requestAdd: zod_1.z.object({
        userName: zod_1.z.string(),
        passWord: zod_1.z.string(),
        role: zod_1.z.enum(enums_1.UserRole),
        teamId: zod_1.z.number().min(1),
    }),
    requestShow: api_request_dto_1.ApiRequestZod.pageQuery.extend({
        userName: zod_1.z.string().optional(),
    }),
    requestUpdate: zod_1.z.object({
        id: zod_1.z.number().min(1),
        userName: zod_1.z.string(),
        passWord: zod_1.z.string(),
        role: zod_1.z.enum(enums_1.UserRole),
        status: zod_1.z.number(),
        teamId: zod_1.z.number().min(1),
    }),
    requestDel: zod_1.z.object({
        id: zod_1.z.number().min(1),
    }),
    responseAdd: api_response_dto_1.ApiResponseZod.extend({ data: responseUserData }),
    responseShow: api_response_dto_1.ApiResponseZod.extend({ data: zod_1.z.array(responseUserData) }),
    responseUpdate: api_response_dto_1.ApiResponseZod.extend({ data: responseUserData }),
    responseDel: api_response_dto_1.ApiResponseZod.extend({ data: responseUserData }),
};
//# sourceMappingURL=user.dto.js.map