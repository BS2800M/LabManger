import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { Status, UserRole } from '../common/enums/enums';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
import { UserDto } from './user.dto';

const hashPassword = (password: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password, 'utf8');
    return hash.digest('hex').toUpperCase();
};

@Injectable()
export class UserService {
    constructor(private readonly prisma: UserPrismaService) { }

    private assertTeamTargetAllowed(session: SessionUser, teamId: number) {
        if (session.role >= UserRole.Director) return;
        if (teamId !== session.teamId) {
            throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
        }
    }

    async add(dto: UserDto['requestAdd'], session: SessionUser): Promise<UserDto['responseAdd']> {
        this.assertTeamTargetAllowed(session, dto.teamId);

        const teamExists = await this.prisma.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new HttpException('不存在的团队id', HttpStatus.FORBIDDEN);
        }

        const user = await this.prisma.user.create({
            data: {
                userName: dto.userName,
                passWord: hashPassword(dto.passWord),
                role: dto.role,
                teamId: dto.teamId,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                userName: user.userName,
                passWord: '*',
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async show(dto: UserDto['requestShow'], session: SessionUser): Promise<UserDto['responseShow']> {
        const where: any = {
            status: { not: Status.Delete },
            ...teamScope(session),
        };
        if (dto.userName) { where.userName = { contains: dto.userName }; }

        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: { team: true },
            }),
            this.prisma.user.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: users.map(user => ({
                id: user.id,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            })),
            meta: { total, page, pageSize, totalPage },
        };
    }

    async update(dto: UserDto['requestUpdate'], session: SessionUser): Promise<UserDto['responseUpdate']> {
        const exists = await this.prisma.user.findFirst({
            where: { id: dto.id, status: { not: Status.Delete }, ...teamScope(session) },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        this.assertTeamTargetAllowed(session, dto.teamId);

        const teamExists = await this.prisma.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new HttpException('不存在的团队id', HttpStatus.FORBIDDEN);
        }

        const user = await this.prisma.user.update({
            where: { id: dto.id },
            data: {
                userName: dto.userName,
                passWord: hashPassword(dto.passWord),
                role: dto.role,
                status: dto.status,
                teamId: dto.teamId,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                userName: user.userName,
                passWord: '*',
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async del(dto: UserDto['requestDel'], session: SessionUser): Promise<UserDto['responseDel']> {
        const exists = await this.prisma.user.findFirst({
            where: { id: dto.id, status: { not: Status.Delete }, ...teamScope(session) },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const user = await this.prisma.user.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }
}
