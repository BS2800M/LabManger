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
exports.LotController = void 0;
const common_1 = require("@nestjs/common");
const lot_service_1 = require("./lot.service");
const lot_dto_1 = require("./lot.dto");
const zod_decorator_1 = require("../common/decorators/zod.decorator");
const session_user_decorator_1 = require("../common/decorators/session-user.decorator");
let LotController = class LotController {
    constructor(lotService) {
        this.lotService = lotService;
    }
    async add(body, session) {
        return this.lotService.add(body, session);
    }
    async show(query, session) {
        return this.lotService.show(query, session);
    }
    async update(body, session) {
        return this.lotService.update(body, session);
    }
    async del(body, session) {
        return this.lotService.del(body, session);
    }
    async showAll(query, session) {
        return this.lotService.showAll(query, session);
    }
};
exports.LotController = LotController;
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, zod_decorator_1.ZodBody)(lot_dto_1.LotZod.requestAdd)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('show'),
    __param(0, (0, zod_decorator_1.ZodQuery)(lot_dto_1.LotZod.requestShow)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "show", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, zod_decorator_1.ZodBody)(lot_dto_1.LotZod.requestUpdate)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('del'),
    __param(0, (0, zod_decorator_1.ZodBody)(lot_dto_1.LotZod.requestDel)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "del", null);
__decorate([
    (0, common_1.Get)('showAll'),
    __param(0, (0, zod_decorator_1.ZodQuery)(lot_dto_1.LotZod.requestShowAll)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "showAll", null);
exports.LotController = LotController = __decorate([
    (0, common_1.Controller)('lot'),
    __metadata("design:paramtypes", [lot_service_1.LotService])
], LotController);
//# sourceMappingURL=lot.controller.js.map