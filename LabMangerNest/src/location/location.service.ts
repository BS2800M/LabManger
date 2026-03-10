import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocationDto } from './location.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
import { Status } from '../common/enums/enums';

@Injectable()
export class LocationService {
    constructor(private readonly prisma: PrismaService) { }
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
            include: { team: { select: { id: true, name: true } } },
        });
        return {
            success: true,
            data: location,
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
            include: { team: { select: { id: true, name: true } } },
        }), this.prisma.location.count({ where })]);
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: locations,
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
            include: { team: { select: { id: true, name: true } } },
        });
        return {
            success: true,
            data: location,
        };
    }
    async del(dto: LocationDto['requestDel'], session: SessionUser): Promise<LocationDto['responseDel']> {
        const location = await this.prisma.location.update({
            where: { id: dto.id },
            data: {
                status: Status.Delete,
            },
            include: { team: { select: { id: true, name: true } } },
        });
        return {
            success: true,
            data: location,
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
    