import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './user.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    add(dto: UserDto['requestAdd']): Promise<UserDto['responseAdd']>;
    show(dto: UserDto['requestShow']): Promise<UserDto['responseShow']>;
    update(dto: UserDto['requestUpdate']): Promise<UserDto['responseUpdate']>;
    del(dto: UserDto['requestDel']): Promise<UserDto['responseDel']>;
}
