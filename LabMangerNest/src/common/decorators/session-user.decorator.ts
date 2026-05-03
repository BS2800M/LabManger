import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../enums/enums';

export interface SessionUser {
    sessionId: string;
    userId: number;
    teamId: number;
    role: UserRole;
    loginType: 'checker' | 'reviewer';
    userName:string;


}

export const SessionUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): SessionUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.sessionUser;
    },
);
