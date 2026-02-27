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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums/enums");
let TeamService = class TeamService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(dto) {
        const team = await this.prisma.team.create({
            data: {
                name: dto.name,
                phone: dto.phone || '',
                note: dto.note || '',
            },
        });
        return { success: true, data: team };
    }
    async show(dto) {
        const where = {
            status: { not: enums_1.Status.Delete },
        };
        if (dto.name) {
            where.name = { contains: dto.name };
        }
        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({
                where,
                skip: ((dto.page || 1) - 1) * (dto.pageSize || 10),
                take: dto.pageSize || 10,
                orderBy: { id: 'desc' },
            }),
            this.prisma.team.count({ where }),
        ]);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: teams, meta: { total, pageSize, page, totalPage } };
    }
    async update(dto) {
        const team = await this.prisma.team.update({
            where: { id: dto.id },
            data: {
                id: dto.id,
                name: dto.name,
                phone: dto.phone,
                note: dto.note,
                status: dto.status
            },
        });
        return { success: true, data: team };
    }
    async del(dto) {
        const team = await this.prisma.team.update({
            where: { id: dto.id },
            data: {
                status: enums_1.Status.Delete,
            },
        });
        return { success: true, data: team };
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamService);
//# sourceMappingURL=team.service.js.map