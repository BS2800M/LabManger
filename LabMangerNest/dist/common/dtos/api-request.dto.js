"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequestZod = void 0;
const zod_1 = require("zod");
const pageNumber = zod_1.z.coerce.number().min(1).optional();
const pageSizeNumber = zod_1.z.coerce.number().min(1).max(100).optional();
exports.ApiRequestZod = {
    pageQuery: zod_1.z.object({
        page: pageNumber,
        pageSize: pageSizeNumber,
    }),
    searchQuery: zod_1.z.object({
        page: pageNumber,
        pageSize: pageSizeNumber,
        name: zod_1.z.string().optional(),
    }),
    timeRange: zod_1.z.object({
        startTime: zod_1.z.coerce.date().optional(),
        endTime: zod_1.z.coerce.date().optional(),
    }),
    timeRangeQuery: zod_1.z.object({
        page: pageNumber,
        pageSize: pageSizeNumber,
        name: zod_1.z.string().optional(),
        startTime: zod_1.z.coerce.date().optional(),
        endTime: zod_1.z.coerce.date().optional(),
    }),
};
//# sourceMappingURL=api-request.dto.js.map