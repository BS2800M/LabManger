import { Controller, Post, Get, Put } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationDto, OperationZod } from './operation.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('operation')
export class OperationController {
    constructor(private readonly operationService: OperationService) { }

    @Post('inbound')
    async inbound(
        @ZodBody(OperationZod.requestInbound) body: OperationDto['requestInbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.inbound(body, session);
    }

    @Post('outbound')
    async outbound(
        @ZodBody(OperationZod.requestOutbound) body: OperationDto['requestOutbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.outbound(body, session);
    }

    @Post('specialOutbound')
    async specialOutbound(
        @ZodBody(OperationZod.requestSpecialOutbound) body: OperationDto['requestSpecialOutbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.specialOutbound(body, session);
    }

    @Get('show')
    async show(
        @ZodQuery(OperationZod.requestShow) query: OperationDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.show(query, session);
    }

    @Get('showAll')
    async showAll(
        @ZodQuery(OperationZod.requestShowAll) query: OperationDto['requestShowAll'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.showAll(query, session);
    }

    @Put('update')
    async update(
        @ZodBody(OperationZod.requestUpdate) body: OperationDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.update(body, session);
    }

    @Put('del')
    async del(
        @ZodBody(OperationZod.requestDel) body: OperationDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.del(body, session);
    }
}
