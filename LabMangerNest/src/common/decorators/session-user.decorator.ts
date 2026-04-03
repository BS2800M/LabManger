import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface SessionUser {
    sessionId: string;
    userId: number;
    teamId: number;
    role: number;
    loginType: 'checker' | 'reviewer';
}

export const SessionUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): SessionUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.sessionUser;
    },
);
