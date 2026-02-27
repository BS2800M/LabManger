import { PrismaService } from '../prisma/prisma.service';
import { ReagentDto } from './reagent.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
export declare class ReagentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    add(dto: ReagentDto['requestAdd'], session: SessionUser): Promise<ReagentDto['responseAdd']>;
    show(dto: ReagentDto['requestShow'], session: SessionUser): Promise<ReagentDto['responseShow']>;
    update(dto: ReagentDto['requestUpdate'], session: SessionUser): Promise<ReagentDto['responseUpdate']>;
    del(dto: ReagentDto['requestDel'], session: SessionUser): Promise<ReagentDto['responseDel']>;
    showAll(session: SessionUser): Promise<ReagentDto['responseShowAll']>;
}
