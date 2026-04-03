import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { AuthDto } from './auth.dto';
import type { Prisma } from '../../generated/prisma-user/client';

const hashPassword = (password: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password, 'utf8');
    return hash.digest('hex').toUpperCase();
};

@Injectable()
export class AuthService {
    constructor(private readonly prisma: UserPrismaService) { }

    private async loadUserForSignin(
        account: string,
        passWord: string,
        loginType: 'checker' | 'reviewer',
        tx: Prisma.TransactionClient,
    ) {
        const hashedPwd = hashPassword(passWord);
        const passwordWhere = loginType === 'checker'
            ? { checkerPassWord: hashedPwd }
            : { reviewerPassWord: hashedPwd };

        const user = await tx.user.findFirst({
            where: { account, ...passwordWhere },
            include: { team: true },
        });

        if (!user) {
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
        return { success: true, data: { status: 0 } };
    }
}
