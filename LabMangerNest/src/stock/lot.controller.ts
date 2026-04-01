import { Controller, Post, Get, Put } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotDto, LotZod } from './lot.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';
import { MangerPrismaService } from '../prisma/manger-prisma.service';

@Controller('stock/lots')
export class LotController {
    constructor(
        private readonly lotService: LotService,
        private readonly prisma: MangerPrismaService,
    ) { }

    @Post('add')
    async add(
        @ZodBody(LotZod.requestAdd) body: LotDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.lotService.add(body, session, tx));
    }

    @Get('show')
    async show(
        @ZodQuery(LotZod.requestShow) query: LotDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.lotService.show(query, session);
    }

    @Put('update')
    async update(
        @ZodBody(LotZod.requestUpdate) body: LotDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.lotService.update(body, session, tx));
    }

    @Put('del')
    async del(
        @ZodBody(LotZod.requestDel) body: LotDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.prisma.$transaction((tx) => this.lotService.del(body, session, tx));
    }

    @Get('showAll')
    async showAll(
        @ZodQuery(LotZod.requestShowAll) query: LotDto['requestShowAll'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.lotService.showAll(query, session);
    }
}
