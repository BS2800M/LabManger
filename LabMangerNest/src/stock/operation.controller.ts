import { Controller, Post, Get, Put } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationDto, OperationZod } from './operation.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('stock/operations')
export class OperationController {
    constructor(private readonly operationService: OperationService) { }

    @Post('fastInbound')
    async fastInbound(
        @ZodBody(OperationZod.requestFastInbound) body: OperationDto['requestFastInbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.fastInbound(body, session);
    }

    @Post('inbound')
    async inbound(
        @ZodBody(OperationZod.requestInbound) body: OperationDto['requestInbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.inbound(body, session);
    }

    @Post('fastOutbound')
    async fastOutbound(
        @ZodBody(OperationZod.requestFastOutbound) body: OperationDto['requestFastOutbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.fastOutbound(body, session);
    }

    @Post('Outbound')
    async outbound(
        @ZodBody(OperationZod.requestOutbound) body: OperationDto['requestOutbound'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.outbound(body, session);
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
    @Put('disable')
    async disable(
        @ZodBody(OperationZod.requestDisable) body: OperationDto['requestDisable'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.operationService.disable(body, session);
    }
}
