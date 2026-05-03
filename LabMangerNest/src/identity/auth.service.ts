import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { AuthDto } from './auth.dto';
import { hashWithSalt } from './password.util';
import { Status } from '../common/enums/enums';
import type { Prisma } from '../../generated/prisma-user/client';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: UserPrismaService) { }

    private async loadUserForSignin(
        account: string,
        passWord: string,
        loginType: 'checker' | 'reviewer',
        tx: Prisma.TransactionClient,
    ) {
        const user = await tx.user.findUnique({
            where: { account },
            include: { team: true },
        });

        if (!user || !user.team) {
            throw new HttpException('用户名或密码错误', HttpStatus.FORBIDDEN);
        }

        const salt = loginType === 'checker' ? user.checkerPassWordSalt : user.reviewerPassWordSalt;
        const storedHash = loginType === 'checker' ? user.checkerPassWord : user.reviewerPassWord;
        const hashedPwd = hashWithSalt(passWord, salt);
        if (hashedPwd !== storedHash) {
            throw new HttpException('用户名或密码错误', HttpStatus.FORBIDDEN);
        }

        return user;
    }

    private async createSessionAndResponse(
        user: any,
        loginType: 'checker' | 'reviewer',
        tx: Prisma.TransactionClient,
    ): Promise<AuthDto['responseSignin']> {
        const sessionId = crypto.randomUUID().replace(/-/g, '');

        await tx.session.create({
            data: {
                sessionId,
                userId: user.id,
                teamId: user.teamId,
                role: user.role,
                loginType,
            },
        });

        return {
            success: true,
            data: {
                sessionId,
                userName: user.userName,
                teamName: user.team.name,
                role: user.role,
                loginType,
            },
        };
    }

    async signinReviewer(
        dto: AuthDto['requestSigninReviewer'],
        tx: Prisma.TransactionClient,
    ): Promise<AuthDto['responseSignin']> {
        const user = await this.loadUserForSignin(dto.account, dto.passWord, 'reviewer', tx);
        return this.createSessionAndResponse(user, 'reviewer', tx);
    }

    async signinChecker(
        dto: AuthDto['requestSigninChecker'],
        tx: Prisma.TransactionClient,
    ): Promise<AuthDto['responseSignin']> {
        const reviewerSession = await tx.session.findUnique({
            where: { sessionId: dto.reviewerSessionId },
        });

        if (!reviewerSession || reviewerSession.loginType !== 'reviewer') {
            throw new HttpException('请先登录审核者', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.loadUserForSignin(dto.account, dto.passWord, 'checker', tx);
        if (user.id === reviewerSession.userId) {
            throw new HttpException('检验者与审核者不能为同一人', HttpStatus.CONFLICT);
        }

        return this.createSessionAndResponse(user, 'checker', tx);
    }

    async signout(dto: AuthDto['requestSignout'], tx: Prisma.TransactionClient): Promise<AuthDto['responseSignout']> {
        if (dto.sessionId) {
            await tx.session.deleteMany({
                where: { sessionId: dto.sessionId },
            });
        }
        return { success: true, data: { status: Status.Enable } };
    }
}
