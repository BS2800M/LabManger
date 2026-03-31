import { Controller, Post, Get } from '@nestjs/common';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthZod, AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('identity/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('signin-reviewer')
    async signinReviewer(@ZodBody(AuthZod.requestSigninReviewer) body: AuthDto['requestSigninReviewer']) {
        return this.authService.signinReviewer(body);
    }

    @Public()
    @Post('signin-checker')
    async signinChecker(@ZodBody(AuthZod.requestSigninChecker) body: AuthDto['requestSigninChecker']) {
        return this.authService.signinChecker(body);
    }

    @Public()
    @Get('signout')
    signout(@ZodQuery(AuthZod.requestSignout) query: AuthDto['requestSignout']) {
        return this.authService.signout(query);
    }
}
