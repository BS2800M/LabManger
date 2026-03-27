import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { UserRole } from '../common/enums/enums';

const responseUserData = z.object({
    id: z.number(),
    userName: z.string(),
    role: z.enum(UserRole),
    status: z.number(),
    teamId: z.number(),
    teamName: z.string().optional(),
    passWord: z.string().optional(),
});

export const UserZod = {
    requestAdd: z.object({
        userName: z.string(),
        passWord: z.string(),
        role: z.enum(UserRole),
        teamId: z.number().min(1),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        userName: z.string().optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        userName: z.string(),
        passWord: z.string(),
        role: z.enum(UserRole),
        status: z.number(),
        teamId: z.number().min(1),
    }),
    requestDel: z.object({
        id: z.number().min(1),
    }),
    responseAdd: ApiResponseZod.extend({ data: responseUserData }),
    responseShow: ApiResponseZod.extend({ data: z.array(responseUserData) }),
    responseUpdate: ApiResponseZod.extend({ data: responseUserData }),
    responseDel: ApiResponseZod.extend({ data: responseUserData }),
} as const;

export type UserDto = ZodToDto<typeof UserZod>;
