import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { SensorRecordService } from './sensorRecord.service';
import { SensorRecordDto, SensorRecordZod } from './sensorRecord.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('sensorRecord')
export class SensorRecordController {
    constructor(private readonly sensorRecordService: SensorRecordService) { }

    @Post('add')
    async add(
        @ZodBody(SensorRecordZod.requestAdd) body: SensorRecordDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.sensorRecordService.add(body, session);
    }

    @Get('show')
    async show(
        @ZodQuery(SensorRecordZod.requestShow) query: SensorRecordDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.sensorRecordService.show(query, session);
    }

    @Put('update')
    async update(
        @ZodBody(SensorRecordZod.requestUpdate) body: SensorRecordDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.sensorRecordService.update(body, session);
    }

    @Put('del')
    async del(
        @ZodBody(SensorRecordZod.requestDel) body: SensorRecordDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.sensorRecordService.del(body, session);
    }

    @Get('showAll')
    async showAll(@SessionUser() session: ISessionUser) {
        return this.sensorRecordService.showAll(session);
    }
}
