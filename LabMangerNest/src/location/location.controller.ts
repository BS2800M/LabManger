import { Controller, Post, Get, Put } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationDto, LocationZod } from './location.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }
    @Post('add')
    async add(
        @ZodBody(LocationZod.requestAdd) body: LocationDto['requestAdd'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.locationService.add(body, session);
    }
    @Get('show')
    async show(
        @ZodQuery(LocationZod.requestShow) query: LocationDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.locationService.show(query, session);
    }
    @Put('update')
    async update(
        @ZodBody(LocationZod.requestUpdate) body: LocationDto['requestUpdate'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.locationService.update(body, session);
    }
    @Put('del')
    async del(
        @ZodBody(LocationZod.requestDel) body: LocationDto['requestDel'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.locationService.del(body, session);
    }
    @Get('showAll')
    async showAll(
        @SessionUser() session: ISessionUser,
    ) {
        return this.locationService.showAll(session);
    }
}