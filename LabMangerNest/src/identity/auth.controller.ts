import { Controller, Post, Get } from '@nestjs/common';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthZod, AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('identity/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('signin')
    async signin(@ZodBody(AuthZod.requestSignin) body: AuthDto['requestSignin']) {
        return this.authService.signin(body);
    }

    @Public()
    @Get('signout')
    signout(@ZodQuery(AuthZod.requestSignout) query: AuthDto['requestSignout']) {
        return this.authService.signout(query);
    }
}
