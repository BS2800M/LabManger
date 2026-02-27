import { Controller, Post, Get, Put } from '@nestjs/common';
import { ReagentService } from './reagent.service';
import { ReagentDto, ReagentZod } from './reagent.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('reagent')
export class ReagentController {
    constructor(private readonly reagentService: ReagentService) { }

    @Post('add')
    async add(
        @ZodBody(ReagentZod.requestAdd) body: ReagentDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.reagentService.add(body, session);
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
        return this.reagentService.update(body, session);
    }

    @Put('del')
    async del(
        @ZodBody(ReagentZod.requestDel) body: ReagentDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.reagentService.del(body, session);
    }

    @Get('showAll')
    async showAll(@SessionUser() session: ISessionUser) {
        return this.reagentService.showAll(session);
    }
}
