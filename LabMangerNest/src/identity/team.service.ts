import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { Status, UserRole } from '../common/enums/enums';
import { teamEntityScope } from '../common/utils/scope.util';
import { TeamDto } from './team.dto';

@Injectable()
export class TeamService {
    constructor(private readonly prisma: UserPrismaService) { }

    async add(dto: TeamDto['requestAdd'], session: SessionUser): Promise<TeamDto['responseAdd']> {
        if (session.role < UserRole.Director) {
            throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
        }
        const team = await this.prisma.team.create({
            data: {
                name: dto.name,
                phone: dto.phone || '',
                note: dto.note || '',
            },
        });

        return { success: true, data: team };
    }

    async show(dto: TeamDto['requestShow'], session: SessionUser): Promise<TeamDto['responseShow']> {
        const where: any = {
            status: { not: Status.Delete },
            ...teamEntityScope(session),
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

    async update(dto: TeamDto['requestUpdate'], session: SessionUser): Promise<TeamDto['responseUpdate']> {
        const existing = await this.prisma.team.findFirst({
            where: { id: dto.id, status: { not: Status.Delete }, ...teamEntityScope(session) },
        });
        if (!existing) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const team = await this.prisma.team.update({
            where: { id: dto.id },
            data: {
                id: dto.id,
                name: dto.name,
                phone: dto.phone,
                note: dto.note,
                status: dto.status,
            },
        });

        return { success: true, data: team };
    }

    async del(dto: TeamDto['requestDel'], session: SessionUser): Promise<TeamDto['responseDel']> {
        const existing = await this.prisma.team.findFirst({
            where: { id: dto.id, status: { not: Status.Delete }, ...teamEntityScope(session) },
        });
        if (!existing) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const team = await this.prisma.team.update({
            where: { id: dto.id },
            data: {
                status: Status.Delete,
            },
        });
        return { success: true, data: team };
    }
}
