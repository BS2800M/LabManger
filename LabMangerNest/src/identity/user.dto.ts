import { z } from 'zod';
import { ApiRequestZod, ZodToDto } from '../common/dtos/api-request.dto';
import { ApiResponseZod } from '../common/dtos/api-response.dto';
import { UserRole } from '../common/enums/enums';

const responseUserData = z.object({
    id: z.number(),
    account: z.string(),
    userName: z.string(),
    role: z.enum(UserRole),
    status: z.number(),
    teamId: z.number(),
    teamName: z.string().optional(),
});

const responseShowAllData = z.object({
    id: z.number(),
    account: z.string(),
    userName: z.string(),
    role: z.enum(UserRole),
    status: z.number(),
    teamId: z.number(),
    teamName: z.string().optional(),
});

export const UserZod = {
    requestAdd: z.object({
        account: z.string(),
        userName: z.string(),
        checkerPassWord: z.string(),
        reviewerPassWord: z.string(),
        role: z.enum(UserRole),
        teamId: z.number().min(1),
        status: z.number().default(0),
    }),
    requestShow: ApiRequestZod.pageQuery.extend({
        keyword: z.string().optional(),
    }),
    requestUpdate: z.object({
        id: z.number().min(1),
        account: z.string(),
        userName: z.string(),
        checkerPassWord: z.string(),
        reviewerPassWord: z.string(),
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
    responseShowAll: ApiResponseZod.extend({ data: z.array(responseShowAllData) }),
} as const;

export type UserDto = ZodToDto<typeof UserZod>;
