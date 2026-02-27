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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const team_dto_1 = require("./team.dto");
const zod_decorator_1 = require("../common/decorators/zod.decorator");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    async add(body) {
        return this.teamService.add(body);
    }
    async show(query) {
        return this.teamService.show(query);
    }
    async update(body) {
        return this.teamService.update(body);
    }
    async del(body) {
        return this.teamService.del(body);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, zod_decorator_1.ZodBody)(team_dto_1.TeamZod.requestAdd)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('show'),
    __param(0, (0, zod_decorator_1.ZodQuery)(team_dto_1.TeamZod.requestShow)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "show", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, zod_decorator_1.ZodBody)(team_dto_1.TeamZod.requestUpdate)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('del'),
    __param(0, (0, zod_decorator_1.ZodBody)(team_dto_1.TeamZod.requestDel)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "del", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)('team'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map