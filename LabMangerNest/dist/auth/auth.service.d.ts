import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './auth.dto';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    signin(dto: AuthDto['requestSignin']): Promise<AuthDto['responseSignin']>;
    signout(dto: AuthDto['requestSignout']): Promise<AuthDto['responseSignout']>;
}
