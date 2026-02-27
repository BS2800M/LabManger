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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const inventory_dto_1 = require("./inventory.dto");
const zod_decorator_1 = require("../common/decorators/zod.decorator");
const session_user_decorator_1 = require("../common/decorators/session-user.decorator");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    show(dto, session) {
        return this.inventoryService.show(dto, session);
    }
    showAll(dto, session) {
        return this.inventoryService.showAll(dto, session);
    }
    auditAll(_dto, session) {
        return this.inventoryService.auditAll(session);
    }
    statistics(dto, session) {
        return this.inventoryService.statistics(dto, session);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('show'),
    __param(0, (0, zod_decorator_1.ZodQuery)(inventory_dto_1.InventoryZod.requestShow)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "show", null);
__decorate([
    (0, common_1.Get)('showAll'),
    __param(0, (0, zod_decorator_1.ZodQuery)(inventory_dto_1.InventoryZod.requestShowAll)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "showAll", null);
__decorate([
    (0, common_1.Post)('auditAll'),
    __param(0, (0, zod_decorator_1.ZodBody)(inventory_dto_1.InventoryZod.requestAuditAll)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "auditAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, zod_decorator_1.ZodQuery)(inventory_dto_1.InventoryZod.requestStatistics)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "statistics", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map