"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.ApiResponseZod = void 0;
const zod_1 = require("zod");
exports.ApiResponseZod = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.any().optional(),
    error: zod_1.z.object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
        details: zod_1.z.any().optional(),
    }).optional(),
    meta: zod_1.z.object({
        page: zod_1.z.number(),
        pageSize: zod_1.z.number(),
        total: zod_1.z.number(),
        totalPage: zod_1.z.number(),
        timestamp: zod_1.z.string().optional(),
    }).optional()
});
exports.HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
//# sourceMappingURL=api-response.dto.js.map