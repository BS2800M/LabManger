"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthZod = void 0;
const zod_1 = require("zod");
const api_response_dto_1 = require("../common/dtos/api-response.dto");
const ResponseSigninData = zod_1.z.object({
    sessionId: zod_1.z.string(),
    userName: zod_1.z.string(),
    teamName: zod_1.z.string(),
    role: zod_1.z.number(),
});
const ResponseSignoutData = zod_1.z.object({
    status: zod_1.z.number(),
});
exports.AuthZod = {
    requestSignin: zod_1.z.object({
        userName: zod_1.z.string(),
        passWord: zod_1.z.string().optional(),
    }),
    requestSignout: zod_1.z.object({
        sessionId: zod_1.z.string().optional(),
    }),
    responseSignin: api_response_dto_1.ApiResponseZod.extend({ data: ResponseSigninData }),
    responseSignout: api_response_dto_1.ApiResponseZod.extend({ data: ResponseSignoutData }),
};
//# sourceMappingURL=auth.dto.js.map