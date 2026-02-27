"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodBody = exports.ZodQuery = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("../pipes/zod-validation.pipe");
const ZodQuery = (schema) => (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(schema));
exports.ZodQuery = ZodQuery;
const ZodBody = (schema) => (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(schema));
exports.ZodBody = ZodBody;
//# sourceMappingURL=zod.decorator.js.map