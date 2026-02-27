import { Controller, Post, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserZod } from './user.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('add')
    async add(@ZodBody(UserZod.requestAdd) body: UserDto['requestAdd']) {
        return this.userService.add(body);
    }

    @Get('show')
    async show(@ZodQuery(UserZod.requestShow) query: UserDto['requestShow']) {
        return this.userService.show(query);
    }

    @Put('update')
    async update(@ZodBody(UserZod.requestUpdate) body: UserDto['requestUpdate']) {
        return this.userService.update(body);
    }

    @Put('del')
    async del(@ZodBody(UserZod.requestDel) body: UserDto['requestDel']) {
        return this.userService.del(body);
    }
}
