import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamDto } from './team.dto';
import { Status } from '../common/enums/enums';

@Injectable()
export class TeamService {
    constructor(private readonly prisma: PrismaService) { }

    async add(dto: TeamDto['requestAdd']): Promise<TeamDto["responseAdd"]> {
        const team = await this.prisma.team.create({
            data: {
                name: dto.name,
                phone: dto.phone || '',
                note: dto.note || '',
            },
        });

        return {success:true,data:team}
    }
    async show(dto: TeamDto['requestShow']): Promise<TeamDto["responseShow"]> {
        const where: any = {
            status: { not: Status.Delete },
        };
        if (dto.name) {
            where.name = { contains: dto.name };
        }

        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({
                where,
                skip: ((dto.page || 1) - 1) * (dto.pageSize || 10),
                take: dto.pageSize || 10,
                orderBy: { id: 'desc' },
            }),
            this.prisma.team.count({ where }),
        ]);
        
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const totalPage = Math.ceil(total / pageSize);
        return {success:true,data:teams,meta:{total,pageSize,page,totalPage}}
    }

    async update(dto: TeamDto['requestUpdate']): Promise<TeamDto["responseUpdate"]> {
        const team = await this.prisma.team.update({
            where: { id: dto.id },
            data: {
                id:dto.id,
                name: dto.name,
                phone: dto.phone,
                note: dto.note,
                status:dto.status
            },
        });

        return {success:true,data:team}
    }

    async del(dto: TeamDto['requestDel']):  Promise<TeamDto["responseDel"]> {
      const team=  await this.prisma.team.update({
            where: { id: dto.id },
            data: {
                status: Status.Delete,
            },
        });
        return {success:true,data:team}
    }
}
