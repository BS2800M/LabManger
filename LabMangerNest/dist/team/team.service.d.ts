import { PrismaService } from '../prisma/prisma.service';
import { TeamDto } from './team.dto';
export declare class TeamService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    add(dto: TeamDto['requestAdd']): Promise<TeamDto["responseAdd"]>;
    show(dto: TeamDto['requestShow']): Promise<TeamDto["responseShow"]>;
    update(dto: TeamDto['requestUpdate']): Promise<TeamDto["responseUpdate"]>;
    del(dto: TeamDto['requestDel']): Promise<TeamDto["responseDel"]>;
}
