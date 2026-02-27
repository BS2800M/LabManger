import { Controller, Post, Get, Put } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamDto } from './team.dto';
import { TeamZod } from './team.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @Post('add')
    async add(@ZodBody(TeamZod.requestAdd) body: TeamDto['requestAdd']) {
        return this.teamService.add(body);
    }

    @Get('show')
    async show(@ZodQuery(TeamZod.requestShow) query: TeamDto['requestShow']) {
        return this.teamService.show(query);
    }

    @Put('update')
    async update(@ZodBody(TeamZod.requestUpdate) body: TeamDto['requestUpdate']) {
        return this.teamService.update(body);
    }

    @Put('del')
    async del(@ZodBody(TeamZod.requestDel) body: TeamDto['requestDel']) {
        return this.teamService.del(body);
    }
}
