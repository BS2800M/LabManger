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

    async signin(dto: AuthDto['requestSignin']): Promise<AuthDto['responseSignin']> {
        const { userName, passWord } = dto;
        const hashedPwd = hashPassword(passWord ?? '');

        const user = await this.prisma.user.findFirst({
            where: { userName, passWord: hashedPwd },
            include: { team: true },
        });

        if (!user) {
            throw new HttpException('用户名或密码错误', HttpStatus.FORBIDDEN);
        }

        const sessionId = crypto.randomUUID().replace(/-/g, '');

        await this.prisma.session.create({
            data: {
                sessionId,
                userId: user.id,
                teamId: user.teamId,
                role: user.role,
            },
        });

        return {
            success: true,
            data: {
                sessionId,
                userName: user.userName,
                teamName: user.team.name,
                role: user.role,
            },
        };
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
