import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { LocationDto } from './location.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
import { Status } from '../common/enums/enums';
import { SensorRecordService } from './sensorRecord.service';
import { UserPrismaService } from '../prisma/user-prisma.service';
@Injectable()
export class LocationService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly userPrisma: UserPrismaService,
        private readonly sensorRecordService: SensorRecordService,
    ) { }

    private async loadTeamMap(teamIds: number[]): Promise<Map<number, string>> {
        if (teamIds.length === 0) return new Map();
        const teams = await this.userPrisma.team.findMany({
            where: { id: { in: teamIds } },
            select: { id: true, name: true },
        });
        return new Map(teams.map((team) => [team.id, team.name]));
    }

    private mapLocationWithTeam(location: any, teamMap: Map<number, string>) {
        return {
            ...location,
            team: {
                id: location.teamId,
                name: teamMap.get(location.teamId) ?? '',
            },
        };
    }

    async add(dto: LocationDto['requestAdd'], session: SessionUser): Promise<LocationDto['responseAdd']> {
        if (dto.minTemperature > dto.maxTemperature) {
            throw new HttpException('最低温度不能大于最高温度', HttpStatus.BAD_REQUEST);
        }
        if (dto.minHumidity > dto.maxHumidity) {
            throw new HttpException('最低湿度不能大于最高湿度', HttpStatus.BAD_REQUEST);
        }
        const location = await this.prisma.location.create({
            data: {
                name: dto.name,
                note: dto.note,
                teamId: session.teamId,
                uploadIntervalMinutes: dto.uploadIntervalMinutes,
                maxTemperature: dto.maxTemperature,
                minTemperature: dto.minTemperature,
                maxHumidity: dto.maxHumidity,
                minHumidity: dto.minHumidity,
                status: dto.status,
                warningTemperature: false,
                warningHumidity: false,
                warningUploadTime: false,
                lastUploadTime: new Date(),
                lastUploadTemperature: 0,
                lastUploadHumidity: 0,
            },
        });
        const teamMap = await this.loadTeamMap([location.teamId]);
        return {
            success: true,
            data: this.mapLocationWithTeam(location, teamMap),
        };
    }
    async show(dto: LocationDto['requestShow'], session: SessionUser): Promise<LocationDto['responseShow']> {
        const where: any = { status: { not: Status.Delete }, ...teamScope(session) };
        if (dto.name) { where.name = { contains: dto.name }; }
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const [locations, total] = await Promise.all([this.prisma.location.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: [{ warningTemperature: 'desc' }, { warningHumidity: 'desc' }, { warningUploadTime: 'desc' }],
        }), this.prisma.location.count({ where })]);
        const teamMap = await this.loadTeamMap([...new Set(locations.map((location) => location.teamId))]);
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: locations.map((location) => this.mapLocationWithTeam(location, teamMap)),
            meta: { total, page, pageSize, totalPage },
        };
    }
    async update(dto: LocationDto['requestUpdate'], session: SessionUser): Promise<LocationDto['responseUpdate']> {
        const location = await this.prisma.location.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                note: dto.note,
                teamId: session.teamId,
                uploadIntervalMinutes: dto.uploadIntervalMinutes,
                maxTemperature: dto.maxTemperature,
                minTemperature: dto.minTemperature,
                maxHumidity: dto.maxHumidity,
                minHumidity: dto.minHumidity,
                status: dto.status,
            },
        });
        await this.sensorRecordService.checkLocationWarning_TempHum(dto.id);
        const teamMap = await this.loadTeamMap([location.teamId]);
        return {
            success: true,
            data: this.mapLocationWithTeam(location, teamMap),
        };
    }
    async del(dto: LocationDto['requestDel'], session: SessionUser): Promise<LocationDto['responseDel']> {
        const location = await this.prisma.location.update({
            where: { id: dto.id },
            data: {
                status: Status.Delete,
            },
        });
        const teamMap = await this.loadTeamMap([location.teamId]);
        return {
            success: true,
            data: this.mapLocationWithTeam(location, teamMap),
        };
    }
    async showAll(session: SessionUser): Promise<LocationDto['responseShowAll']> {
        const locations = await this.prisma.location.findMany({
            where: { status: { not: Status.Delete }, ...teamScope(session) },
            select: { id: true, name: true },
        });
        return {
            success: true,
            data: locations,
        };
    }
}   



