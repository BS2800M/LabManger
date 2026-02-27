import { z } from 'zod';
import { ApiResponseZod } from 'src/common/dtos/api-response.dto';
import { ZodToDto } from 'src/common/dtos/api-request.dto';

const ResponseSigninData = z.object({
    sessionId: z.string(),
    userName: z.string(),
    teamName: z.string(),
    role: z.number(),
});

const ResponseSignoutData = z.object({
    status: z.number(),
});

export const AuthZod = {
    requestSignin: z.object({
        userName: z.string(),
        passWord: z.string().optional(),
    }),
    requestSignout: z.object({
        sessionId: z.string().optional(),
    }),
    responseSignin: ApiResponseZod.extend({ data: ResponseSigninData }),
    responseSignout: ApiResponseZod.extend({ data: ResponseSignoutData }),
} as const;

export type AuthDto = ZodToDto<typeof AuthZod>;
