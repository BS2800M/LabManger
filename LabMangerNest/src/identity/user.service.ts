import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Status } from '../common/enums/enums';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { UserDto } from './user.dto';
import { generateSalt, hashWithSalt } from './password.util';
import type { Prisma } from '../../generated/prisma-user/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: UserPrismaService) { }

    private buildPasswordStorage(checkerPlainPassword: string, reviewerPlainPassword: string) {
        const checkerPassWordSalt = generateSalt();
        const reviewerPassWordSalt = generateSalt();
        return {
            checkerPassWordSalt,
            reviewerPassWordSalt,
            checkerPassWord: hashWithSalt(checkerPlainPassword, checkerPassWordSalt),
            reviewerPassWord: hashWithSalt(reviewerPlainPassword, reviewerPassWordSalt),
        };
    }

    async add(
        dto: UserDto['requestAdd'],
        session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<UserDto['responseAdd']> {
        const teamExists = await tx.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new HttpException('不存在的团队id', HttpStatus.FORBIDDEN);
        }
        const accountExists = await tx.user.findFirst({
            where: { account: dto.account, status: { not: Status.Delete as any } },
        });
        if (accountExists) {
            throw new HttpException('账号已存在', HttpStatus.FORBIDDEN);
        }

        const passwordStorage = this.buildPasswordStorage(dto.checkerPassWord, dto.reviewerPassWord);
        const user = await tx.user.create({
            data: {
                account: dto.account,
                userName: dto.userName,
                role: dto.role as any,
                teamId: dto.teamId,
                status: dto.status as any,
                ...passwordStorage,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                account: user.account,
                userName: user.userName,
                role: user.role as any,
                status: user.status as any,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async show(dto: UserDto['requestShow'], session: SessionUser): Promise<UserDto['responseShow']> {
        const where: any = {
            status: { not: Status.Delete as any },
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
                role: user.role as any,
                status: user.status as any,
                teamId: user.teamId,
                teamName: user.team.name,
            })),
            meta: { total, page, pageSize, totalPage },
        };
    }

    async update(
        dto: UserDto['requestUpdate'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<UserDto['responseUpdate']> {
        const exists = await tx.user.findFirst({
            where: { id: dto.id, status: { not: Status.Delete as any } },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const teamExists = await tx.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new HttpException('不存在的团队id', HttpStatus.FORBIDDEN);
        }
        const accountExists = await tx.user.findFirst({
            where: {
                account: dto.account,
                status: { not: Status.Delete as any },
                id: { not: dto.id },
            },
        });
        if (accountExists) {
            throw new HttpException('账号已存在', HttpStatus.FORBIDDEN);
        }

        const passwordStorage = this.buildPasswordStorage(dto.checkerPassWord, dto.reviewerPassWord);
        const user = await tx.user.update({
            where: { id: dto.id },
            data: {
                account: dto.account,
                userName: dto.userName,
                role: dto.role as any,
                status: dto.status as any,
                teamId: dto.teamId,
                ...passwordStorage,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                account: user.account,
                userName: user.userName,
                role: user.role as any,
                status: user.status as any,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async del(
        dto: UserDto['requestDel'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<UserDto['responseDel']> {
        const exists = await tx.user.findFirst({
            where: { id: dto.id, status: { not: Status.Delete as any } },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const user = await tx.user.update({
            where: { id: dto.id },
            data: { status: Status.Delete as any },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                account: user.account,
                userName: user.userName,
                role: user.role as any,
                status: user.status as any,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }

    async showAll(): Promise<UserDto['responseShowAll']> {
        const users = await this.prisma.user.findMany({
            where: { status: Status.Enable as any },
            orderBy: { id: 'asc' },
            include: { team: true },
        });

        return {
            success: true,
            data: users.map(user => ({
                id: user.id,
                account: user.account,
                userName: user.userName,
                role: user.role as any,
                status: user.status as any,
                teamId: user.teamId,
                teamName: user.team?.name,
            })),
        };
    }
}
