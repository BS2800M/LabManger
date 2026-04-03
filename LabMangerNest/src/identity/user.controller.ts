import { Controller, Post, Get, Put } from '@nestjs/common';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserDto, UserZod } from './user.dto';
import { UserService } from './user.service';
import { UserPrismaService } from '../prisma/user-prisma.service';

@Controller('identity/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly prisma: UserPrismaService,
    ) { }

    @Post('add')
    async add(
        @ZodBody(UserZod.requestAdd) body: UserDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.userService.add(body, session, tx));
    }

    @Get('show')
    async show(
        @ZodQuery(UserZod.requestShow) query: UserDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.userService.show(query, session);
    }

    @Public()
    @Get('showAll')
    async showAll() {
        return this.userService.showAll();
    }

    @Put('update')
    async update(
        @ZodBody(UserZod.requestUpdate) body: UserDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.userService.update(body, session, tx));
    }

    @Put('del')
    async del(
        @ZodBody(UserZod.requestDel) body: UserDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.userService.del(body, session, tx));
    }
}
