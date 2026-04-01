import { Controller, Post, Get, Put } from '@nestjs/common';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
import { TeamDto, TeamZod } from './team.dto';
import { TeamService } from './team.service';
import { UserPrismaService } from '../prisma/user-prisma.service';

@Controller('identity/team')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
        private readonly prisma: UserPrismaService,
    ) { }

    @Post('add')
    async add(
        @ZodBody(TeamZod.requestAdd) body: TeamDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.teamService.add(body, session, tx));
    }

    @Get('show')
    async show(
        @ZodQuery(TeamZod.requestShow) query: TeamDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.teamService.show(query, session);
    }

    @Put('update')
    async update(
        @ZodBody(TeamZod.requestUpdate) body: TeamDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.teamService.update(body, session, tx));
    }

    @Put('del')
    async del(
        @ZodBody(TeamZod.requestDel) body: TeamDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.teamService.del(body, session, tx));
    }
}
