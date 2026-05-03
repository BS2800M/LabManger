import { z } from 'zod';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { ZodToDto } from '../common/dtos/api-request.dto';
import { Status, UserRole } from '../common/enums/enums';

export const LoginTypeZod = z.enum(['checker', 'reviewer']);
const SigninBaseZod = z.object({
    account: z.string(),
    passWord: z.string(),
});

const ResponseSigninData = z.object({
    sessionId: z.string(),
    userName: z.string(),
    teamName: z.string(),
    role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
    loginType: LoginTypeZod,
});

const ResponseSignoutData = z.object({
    status: z.enum(Object.values(Status) as [Status, ...Status[]]),
});

export const AuthZod = {
    requestSigninReviewer: SigninBaseZod,
    requestSigninChecker: SigninBaseZod.extend({
        reviewerSessionId: z.string(),
    }),
    requestSignout: z.object({
        sessionId: z.string().optional(),
    }),
    responseSignin: ApiResponseZod.extend({ data: ResponseSigninData }),
    responseSignout: ApiResponseZod.extend({ data: ResponseSignoutData }),
} as const;

export type AuthDto = ZodToDto<typeof AuthZod>;
