import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPrismaService } from '../../prisma/user-prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: UserPrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const sessionId = request.headers['sessionid'];

        if (!sessionId) {
            throw new UnauthorizedException('缺少 sessionid');
        }

        const session = await this.prisma.session.findUnique({
            where: { sessionId },
        });

        if (!session) {
            throw new UnauthorizedException('非法请求：sessionid 无效');
        }

        request.sessionUser = {
            sessionId: session.sessionId,
            userId: session.userId,
            teamId: session.teamId,
            role: session.role,
        };

        return true;
    }
}
