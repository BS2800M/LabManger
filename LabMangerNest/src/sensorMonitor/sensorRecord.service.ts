import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { SensorRecordDto } from './sensorRecord.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { Status } from '../common/enums/enums';
import { UserPrismaService } from '../prisma/user-prisma.service';
import type { Prisma } from '../../generated/prisma-manger/client';
@Injectable()
export class SensorRecordService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly userPrisma: UserPrismaService,
    ) { }



    async checkLocationWarning_TempHum(locationId: number, tx: Prisma.TransactionClient): Promise<void> {
        const location = await tx.location.findFirst({
            where: { id: locationId },
        });
        if (!location) {
            throw new HttpException('不存在的位置id', HttpStatus.FORBIDDEN);
        }
        if (location.lastUploadTemperature > location.maxTemperature || location.lastUploadTemperature < location.minTemperature) {
            await tx.location.update({
                where: { id: locationId },
                data: {
                    warningTemperature: true,
                },
            });
        }
        else {
            await tx.location.update({
                where: { id: locationId },
                data: {
                    warningTemperature: false,
                },
            });
        }
        if (location.lastUploadHumidity < location.minHumidity || location.lastUploadHumidity > location.maxHumidity) {
            await tx.location.update({
                where: { id: locationId },
                data: {
                    warningHumidity: true,
                },
            });
        }
        else {
            await tx.location.update({
                where: { id: locationId },
                data: {
                    warningHumidity: false,
                },
            });
        }
    }

    async add(
        dto: SensorRecordDto['requestAdd'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<SensorRecordDto['responseAdd']> {
        const locationIds = [...new Set(dto.data.map(item => item.locationId))];
        const validLocations = await tx.location.findMany({
            where: { id: { in: locationIds } },
            select: {
                id: true,
                teamId: true,
                maxTemperature: true,
                minTemperature: true,
                maxHumidity: true,
                minHumidity: true,
            },
        });
        const validIds = new Set(validLocations.map(l => l.id));
        const locationMap = new Map(validLocations.map(l => [l.id, l]));
        const invalidId = locationIds.find(id => !validIds.has(id));
        if (invalidId !== undefined) {
            throw new HttpException(`不存在的位置id: ${invalidId}`, HttpStatus.FORBIDDEN);
        }

        const teamIds = [...new Set(validLocations.map((location) => location.teamId))];
        const teamRows = await this.userPrisma.team.findMany({
            where: { id: { in: teamIds } },
            select: { id: true, name: true },
        });
        const teamNameMap = new Map(teamRows.map((team) => [team.id, team.name]));

        await tx.sensorRecord.createMany({
            data: dto.data.map(item => {
                const loc = locationMap.get(item.locationId)!;
                return {
                    locationId: item.locationId,
                    teamId: loc.teamId,
                    teamName: teamNameMap.get(loc.teamId) ?? '',
                    temperature: item.temperature,
                    humidity: item.humidity,
                    createTime: item.createTime,
                    battery: item.battery,
                    warningTemperature: item.temperature > loc.maxTemperature || item.temperature < loc.minTemperature,
                    warningHumidity: item.humidity < loc.minHumidity || item.humidity > loc.maxHumidity,
                };
            }),
        });
        let promises: Promise<unknown>[] = [];
        for (const record of dto.data) {
            promises.push(tx.location.update({
                where: { id: record.locationId },
                data: {
                    lastUploadTime: new Date(),
                    lastUploadTemperature: record.temperature,
                    lastUploadHumidity: record.humidity,
                    lastUploadBattery: record.battery,
                    warningUploadTime: false,
                },
            }));
        }   
        await Promise.all(promises);
        promises = [];
        for (const record of dto.data) {
            promises.push(this.checkLocationWarning_TempHum(record.locationId, tx));
        }
        await Promise.all(promises);


        return { success: true, data: "添加成功" };
    }
    

    async show(dto: SensorRecordDto['requestShow'], session: SessionUser): Promise<SensorRecordDto['responseShow']> {
        const where: any = {};
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
                },
            }), 
            this.prisma.sensorRecord.count({ where }),
        ]);
        const recordsx=records.map(record => {
            return {
                ...record,
                team: {
                    id: record.teamId,
                    name: record.teamName,
                },
            };
        });
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: recordsx,
            meta: { total, page, pageSize, totalPage },
        };
    }

    async update(
        dto: SensorRecordDto['requestUpdate'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<SensorRecordDto['responseUpdate']> {
        const exists = await tx.sensorRecord.findFirst({
            where: { id: dto.id },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const validLocation = await tx.location.findFirst({
            where: { id: dto.locationId },
            select: { id: true },
        });
        if (!validLocation) {
            throw new HttpException('不存在的位置id', HttpStatus.FORBIDDEN);
        }
        const record = await tx.sensorRecord.update({
            where: { id: dto.id },
            data: {
                temperature: dto.temperature,
                humidity: dto.humidity,
                locationId: dto.locationId,
                createTime: dto.createTime,
                battery: dto.battery,
            },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const recordx = {...record, team: { id: record.teamId, name: record.teamName }};
        return { success: true, data: recordx };
    }

    async del(
        dto: SensorRecordDto['requestDel'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<SensorRecordDto['responseDel']> {
        const exists = await tx.sensorRecord.findFirst({
            where: { id: dto.id },
        });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const record = await tx.sensorRecord.delete({
            where: { id: dto.id },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },  
        });
        const recordx = {...record, team: { id: record.teamId, name: record.teamName }};
        return { success: true, data: recordx };
    }

    async showAll(session: SessionUser): Promise<SensorRecordDto['responseShowAll']> {
        const records = await this.prisma.sensorRecord.findMany({
            orderBy: { id: 'desc' },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const recordsx=records.map(record => {
            return {
                ...record,
                team: {
                    id: record.teamId,
                    name: record.teamName,
                },
            };
        });
        return { success: true, data: recordsx };
    }

    async checkUploadTimeout(tx: Prisma.TransactionClient): Promise<{ overdueCount: number; normalCount: number }> {
        const locations = await tx.location.findMany({
            where: { uploadIntervalMinutes: { gt: 0 },status:Status.Enable },
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
            overdueIds.length > 0 && tx.location.updateMany({
                where: { id: { in: overdueIds } },
                data: { warningUploadTime: true },
            }),
            normalIds.length > 0 && tx.location.updateMany({
                where: { id: { in: normalIds } },
                data: { warningUploadTime: false },
            }),
        ]);

        return { overdueCount: overdueIds.length, normalCount: normalIds.length };
    }

}
