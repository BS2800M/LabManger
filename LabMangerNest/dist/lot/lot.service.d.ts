import { PrismaService } from '../prisma/prisma.service';
import { LotDto } from './lot.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
export declare class LotService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    add(dto: LotDto['requestAdd'], session: SessionUser): Promise<LotDto['responseAdd']>;
    show(dto: LotDto['requestShow'], session: SessionUser): Promise<LotDto['responseShow']>;
    update(dto: LotDto['requestUpdate'], session: SessionUser): Promise<LotDto['responseUpdate']>;
    del(dto: LotDto['requestDel'], session: SessionUser): Promise<LotDto['responseDel']>;
    showAll(dto: LotDto['requestShowAll'], session: SessionUser): Promise<LotDto['responseShowAll']>;
}
