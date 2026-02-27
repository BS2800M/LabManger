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
exports.ReagentController = void 0;
const common_1 = require("@nestjs/common");
const reagent_service_1 = require("./reagent.service");
const reagent_dto_1 = require("./reagent.dto");
const zod_decorator_1 = require("../common/decorators/zod.decorator");
const session_user_decorator_1 = require("../common/decorators/session-user.decorator");
let ReagentController = class ReagentController {
    constructor(reagentService) {
        this.reagentService = reagentService;
    }
    async add(body, session) {
        return this.reagentService.add(body, session);
    }
    async show(query, session) {
        return this.reagentService.show(query, session);
    }
    async update(body, session) {
        return this.reagentService.update(body, session);
    }
    async del(body, session) {
        return this.reagentService.del(body, session);
    }
    async showAll(session) {
        return this.reagentService.showAll(session);
    }
};
exports.ReagentController = ReagentController;
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, zod_decorator_1.ZodBody)(reagent_dto_1.ReagentZod.requestAdd)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReagentController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('show'),
    __param(0, (0, zod_decorator_1.ZodQuery)(reagent_dto_1.ReagentZod.requestShow)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReagentController.prototype, "show", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, zod_decorator_1.ZodBody)(reagent_dto_1.ReagentZod.requestUpdate)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReagentController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('del'),
    __param(0, (0, zod_decorator_1.ZodBody)(reagent_dto_1.ReagentZod.requestDel)),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReagentController.prototype, "del", null);
__decorate([
    (0, common_1.Get)('showAll'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReagentController.prototype, "showAll", null);
exports.ReagentController = ReagentController = __decorate([
    (0, common_1.Controller)('reagent'),
    __metadata("design:paramtypes", [reagent_service_1.ReagentService])
], ReagentController);
//# sourceMappingURL=reagent.controller.js.map