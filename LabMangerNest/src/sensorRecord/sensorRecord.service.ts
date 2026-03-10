import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorRecordDto } from './sensorRecord.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
@Injectable()
export class SensorRecordService {
    constructor(private readonly prisma: PrismaService) { }

    async checkLocationWarning_TempHum(locationId: number): Promise<void> {
        const location = await this.prisma.location.findFirst({
            where: { id: locationId },
        });
        if (location.lastUploadTemperature > location.maxTemperature || location.lastUploadTemperature < location.minTemperature) {
            await this.prisma.location.update({
                where: { id: locationId },
                data: {
                    warningTemperature: true,
                },
            });
        }
        else {
            await this.prisma.location.update({
                where: { id: locationId },
                data: {
                    warningTemperature: false,
                },
            });
        }
        if (location.lastUploadHumidity < location.minHumidity || location.lastUploadHumidity > location.maxHumidity) {
            await this.prisma.location.update({
                where: { id: locationId },
                data: {
                    warningHumidity: true,
                },
            });
        }
        else {
            await this.prisma.location.update({
                where: { id: locationId },
                data: {
                    warningHumidity: false,
                },
            });
        }
    }

    async add(dto: SensorRecordDto['requestAdd'], session: SessionUser): Promise<SensorRecordDto['responseAdd']> {
        const locationIds = [...new Set(dto.data.map(item => item.locationId))];
        const validLocations = await this.prisma.location.findMany({
            where: { id: { in: locationIds }, ...teamScope(session) },
            select: { id: true },
        });
        const validIds = new Set(validLocations.map(l => l.id));
        const invalidId = locationIds.find(id => !validIds.has(id));
        if (invalidId !== undefined) {
            throw new HttpException(`不存在的位置id: ${invalidId}`, HttpStatus.FORBIDDEN);
        }

        await this.prisma.sensorRecord.createMany({
            data: dto.data.map(item => ({
                locationId: item.locationId,
                teamId: session.teamId,
                temperature: item.temperature,
                humidity: item.humidity,
                createTime: item.createTime,
            })),
        });
        let promises = [];
        for (const record of dto.data) {
            promises.push(this.prisma.location.update({
                where: { id: record.locationId },
                data: {
                    lastUploadTime: new Date(),
                    lastUploadTemperature: record.temperature,
                    lastUploadHumidity: record.humidity,
                },
            }));
        }   
        await Promise.all(promises);
        promises = [];
        for (const record of dto.data) {
            promises.push(this.checkLocationWarning_TempHum(record.locationId));
        }
        await Promise.all(promises);


        return { success: true, data:"添加成功"};
    }
    

    async show(dto: SensorRecordDto['requestShow'], session: SessionUser): Promise<SensorRecordDto['responseShow']> {
        const where: any = { ...teamScope(session) };
        if (dto.locationName) { where.location = { name: { contains: dto.locationName } }; }
        if (dto.startTime || dto.endTime) {
            where.createTime = {};
            if (dto.startTime) { where.createTime.gte = dto.startTime; }
            if (dto.endTime) { where.createTime.lte = dto.endTime; }
        }

        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        const [records, total] = await Promise.all([
            this.prisma.sensorRecord.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: {
                    location: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    team: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }), 
            this.prisma.sensorRecord.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: records, meta: { total, page, pageSize, totalPage } };
    }

    async update(dto: SensorRecordDto['requestUpdate'], session: SessionUser): Promise<SensorRecordDto['responseUpdate']> {
        const exists = await this.prisma.sensorRecord.findFirst({
            where: { id: dto.id, ...teamScope(session) },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const validLocation = await this.prisma.location.findFirst({
            where: { id: dto.locationId, ...teamScope(session) },
            select: { id: true },
        });
        if (!validLocation) {
            throw new HttpException('不存在的位置id', HttpStatus.FORBIDDEN);
        }
        const record = await this.prisma.sensorRecord.update({
            where: { id: dto.id },
            data: {
                temperature: dto.temperature,
                humidity: dto.humidity,
                locationId: dto.locationId,
                createTime: dto.createTime,
            },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return { success: true, data: record };
    }

    async del(dto: SensorRecordDto['requestDel'], session: SessionUser): Promise<SensorRecordDto['responseDel']> {
        const exists = await this.prisma.sensorRecord.findFirst({
            where: { id: dto.id, ...teamScope(session) },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const record = await this.prisma.sensorRecord.delete({
            where: { id: dto.id },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },  
        });

        return { success: true, data: record };
    }

    async showAll(session: SessionUser): Promise<SensorRecordDto['responseShowAll']> {
        const records = await this.prisma.sensorRecord.findMany({
            where: { ...teamScope(session) },
            orderBy: { id: 'desc' },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return { success: true, data: records };
    }

    async checkUploadTimeout(): Promise<{ overdueCount: number; normalCount: number }> {
        const locations = await this.prisma.location.findMany({
            where: { uploadIntervalMinutes: { gt: 0 } },
            select: { id: true, lastUploadTime: true, uploadIntervalMinutes: true },
        });

        const now = new Date();
        const overdueIds: number[] = [];
        const normalIds: number[] = [];

        for (const loc of locations) {
            const deadline = new Date(loc.lastUploadTime);
            deadline.setMinutes(deadline.getMinutes() + loc.uploadIntervalMinutes);
            if (now > deadline) {
                overdueIds.push(loc.id);
            } else {
                normalIds.push(loc.id);
            }
        }

        await Promise.all([
            overdueIds.length > 0 && this.prisma.location.updateMany({
                where: { id: { in: overdueIds } },
                data: { warningUploadTime: true },
            }),
            normalIds.length > 0 && this.prisma.location.updateMany({
                where: { id: { in: normalIds } },
                data: { warningUploadTime: false },
            }),
        ]);

        return { overdueCount: overdueIds.length, normalCount: normalIds.length };
    }
}
