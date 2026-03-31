import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { AuthDto } from './auth.dto';

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
    ) {
        const hashedPwd = hashPassword(passWord);
        const passwordWhere = loginType === 'checker'
            ? { checkerPassWord: hashedPwd }
            : { reviewerPassWord: hashedPwd };

        const user = await this.prisma.user.findFirst({
            where: { account, ...passwordWhere },
            include: { team: true },
        });

        if (!user) {
            throw new HttpException('用户名或密码错误', HttpStatus.FORBIDDEN);
        }

        return user;
    }

    private async createSessionAndResponse(user: any, loginType: 'checker' | 'reviewer'): Promise<AuthDto['responseSignin']> {
        const sessionId = crypto.randomUUID().replace(/-/g, '');

        await this.prisma.session.create({
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

    async signinReviewer(dto: AuthDto['requestSigninReviewer']): Promise<AuthDto['responseSignin']> {
        const user = await this.loadUserForSignin(dto.account, dto.passWord, 'reviewer');
        return this.createSessionAndResponse(user, 'reviewer');
    }

    async signinChecker(dto: AuthDto['requestSigninChecker']): Promise<AuthDto['responseSignin']> {
        const reviewerSession = await this.prisma.session.findUnique({
            where: { sessionId: dto.reviewerSessionId },
        });

        if (!reviewerSession || reviewerSession.loginType !== 'reviewer') {
            throw new HttpException('请先登录审核者', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.loadUserForSignin(dto.account, dto.passWord, 'checker');
        if (user.id === reviewerSession.userId) {
            throw new HttpException('检验者与审核者不能为同一人', HttpStatus.CONFLICT);
        }

        return this.createSessionAndResponse(user, 'checker');
    }

    async signout(dto: AuthDto['requestSignout']): Promise<AuthDto['responseSignout']> {
        if (dto.sessionId) {
            await this.prisma.session.deleteMany({
                where: { sessionId: dto.sessionId },
            });
        }
        return { success: true, data: { status: 0 } };
    }
}
