import { Controller, Post, Get } from '@nestjs/common';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthZod, AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { UserPrismaService } from '../prisma/user-prisma.service';

@Controller('identity/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly prisma: UserPrismaService,
    ) { }

    @Public()
    @Post('signin-reviewer')
    async signinReviewer(@ZodBody(AuthZod.requestSigninReviewer) body: AuthDto['requestSigninReviewer']) {
        return this.prisma.$transaction((tx) => this.authService.signinReviewer(body, tx));
    }

    @Public()
    @Post('signin-checker')
    async signinChecker(@ZodBody(AuthZod.requestSigninChecker) body: AuthDto['requestSigninChecker']) {
        return this.prisma.$transaction((tx) => this.authService.signinChecker(body, tx));
    }

    @Public()
    @Get('signout')
    signout(@ZodQuery(AuthZod.requestSignout) query: AuthDto['requestSignout']) {
        return this.prisma.$transaction((tx) => this.authService.signout(query, tx));
    }
}
