import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { Status } from '../common/enums/enums';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { UserDto } from './user.dto';

const hashPassword = (password: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password, 'utf8');
    return hash.digest('hex').toUpperCase();
};

@Injectable()
export class UserService {
    constructor(private readonly prisma: UserPrismaService) { }

    async add(dto: UserDto['requestAdd'], session: SessionUser): Promise<UserDto['responseAdd']> {
        const teamExists = await this.prisma.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new HttpException('不存在的团队id', HttpStatus.FORBIDDEN);
        }
        const accountExists = await this.prisma.user.findFirst({
            where: { account: dto.account, status: { not: Status.Delete } },
        });
        if (accountExists) {
            throw new HttpException('账号已存在', HttpStatus.FORBIDDEN);
        }

        const user = await this.prisma.user.create({
            data: {
                account: dto.account,
                userName: dto.userName,
                checkerPassWord: hashPassword(dto.checkerPassWord),
                reviewerPassWord: hashPassword(dto.reviewerPassWord),
                role: dto.role,
                teamId: dto.teamId,
                status: dto.status,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                account: user.account,
                userName: user.userName,
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
        };
        if (dto.keyword) {
            where.OR = [
                { account: { contains: dto.keyword } },
                { userName: { contains: dto.keyword } },
            ];
        }

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
                account: user.account,
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
            where: { id: dto.id, status: { not: Status.Delete } },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const teamExists = await this.prisma.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new HttpException('不存在的团队id', HttpStatus.FORBIDDEN);
        }
        const accountExists = await this.prisma.user.findFirst({
            where: {
                account: dto.account,
                status: { not: Status.Delete },
                id: { not: dto.id },
            },
        });
        if (accountExists) {
            throw new HttpException('账号已存在', HttpStatus.FORBIDDEN);
        }

        const user = await this.prisma.user.update({
            where: { id: dto.id },
            data: {
                account: dto.account,
                userName: dto.userName,
                checkerPassWord: hashPassword(dto.checkerPassWord),
                reviewerPassWord: hashPassword(dto.reviewerPassWord),
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
                account: user.account,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async del(dto: UserDto['requestDel'], session: SessionUser): Promise<UserDto['responseDel']> {
        const exists = await this.prisma.user.findFirst({
            where: { id: dto.id, status: { not: Status.Delete } },
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
                account: user.account,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async showAll(): Promise<UserDto['responseShowAll']> {
        const users = await this.prisma.user.findMany({
            where: { status: Status.Enable },
            orderBy: { id: 'asc' },
            include: { team: true },
        });

        return {
            success: true,
            data: users.map(user => ({
                id: user.id,
                account: user.account,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team?.name,
            })),
        };
    }
}
