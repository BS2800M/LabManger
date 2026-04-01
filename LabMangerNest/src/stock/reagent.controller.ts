import { Controller, Post, Get, Put } from '@nestjs/common';
import { ReagentService } from './reagent.service';
import { ReagentDto, ReagentZod } from './reagent.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
import { MangerPrismaService } from '../prisma/manger-prisma.service';

@Controller('stock/reagents')
export class ReagentController {
    constructor(
        private readonly reagentService: ReagentService,
        private readonly prisma: MangerPrismaService,
    ) { }

    @Post('add')
    async add(
        @ZodBody(ReagentZod.requestAdd) body: ReagentDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.reagentService.add(body, session, tx));
    }

    @Get('show')
    async show(
        @ZodQuery(ReagentZod.requestShow) query: ReagentDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.reagentService.show(query, session);
    }

    @Put('update')
    async update(
        @ZodBody(ReagentZod.requestUpdate) body: ReagentDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.reagentService.update(body, session, tx));
    }

    @Put('del')
    async del(
        @ZodBody(ReagentZod.requestDel) body: ReagentDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.reagentService.del(body, session, tx));
    }

    @Get('showAll')
    async showAll(@SessionUser() session: ISessionUser) {
        return this.reagentService.showAll(session);
    }
}
