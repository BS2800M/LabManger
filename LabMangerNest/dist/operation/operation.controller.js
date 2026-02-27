"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationController = void 0;
const common_1 = require("@nestjs/common");
const operation_service_1 = require("./operation.service");
const operation_dto_1 = require("./operation.dto");
const zod_decorator_1 = require("../common/decorators/zod.decorator");
const session_user_decorator_1 = require("../common/decorators/session-user.decorator");
let OperationController = class OperationController {
    constructor(operationService) {
        this.operationService = operationService;
    }
    async inbound(body, session) {
        return this.operationService.inbound(body, session);
    }
    async outbound(body, session) {
        return this.operationService.outbound(body, session);
    }
    async specialOutbound(body, session) {
        return this.operationService.specialOutbound(body, session);
    }
    async show(query, session) {
        return this.operationService.show(query, session);
    }
    async showAll(query, session) {
        return this.operationService.showAll(query, session);
    }
    async update(body, session) {
        return this.operationService.update(body, session);
    }
    async del(body, session) {
        return this.operationService.del(body, session);
    }
};
exports.OperationController = OperationController;
__decorate([
    (0, common_1.Post)('inbound'),
    __param(0, (0, zod_decorator_1.ZodBody)(operation_dto_1.OperationZod.requestInbound)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "inbound", null);
__decorate([
    (0, common_1.Post)('outbound'),
    __param(0, (0, zod_decorator_1.ZodBody)(operation_dto_1.OperationZod.requestOutbound)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "outbound", null);
__decorate([
    (0, common_1.Post)('specialOutbound'),
    __param(0, (0, zod_decorator_1.ZodBody)(operation_dto_1.OperationZod.requestSpecialOutbound)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "specialOutbound", null);
__decorate([
    (0, common_1.Get)('show'),
    __param(0, (0, zod_decorator_1.ZodQuery)(operation_dto_1.OperationZod.requestShow)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "show", null);
__decorate([
    (0, common_1.Get)('showAll'),
    __param(0, (0, zod_decorator_1.ZodQuery)(operation_dto_1.OperationZod.requestShowAll)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "showAll", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, zod_decorator_1.ZodBody)(operation_dto_1.OperationZod.requestUpdate)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('del'),
    __param(0, (0, zod_decorator_1.ZodBody)(operation_dto_1.OperationZod.requestDel)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationController.prototype, "del", null);
exports.OperationController = OperationController = __decorate([
    (0, common_1.Controller)('operation'),
    __metadata("design:paramtypes", [operation_service_1.OperationService])
], OperationController);
//# sourceMappingURL=operation.controller.js.map