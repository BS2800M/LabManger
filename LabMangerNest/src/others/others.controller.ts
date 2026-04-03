import { Controller, Get } from '@nestjs/common';
import { ZodQuery } from '../common/decorators/zod.decorator';
import { Public } from '../common/decorators/public.decorator';
import { OthersDto, OthersZod } from './others.dto';
import { OthersService } from './others.service';

@Controller('others')
export class OthersController {
    constructor(private readonly othersService: OthersService) { }

    @Public()
    @Get('time')
    async time(@ZodQuery(OthersZod.requestTime) query: OthersDto['requestTime']) {
        return this.othersService.time(query);
    }
}
