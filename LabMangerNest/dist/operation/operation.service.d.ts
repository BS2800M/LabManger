import { PrismaService } from '../prisma/prisma.service';
import { OperationDto } from './operation.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
export declare class OperationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateBarcode;
    private updateInventory;
    private auditInventory;
    inbound(dto: OperationDto['requestInbound'], session: SessionUser): Promise<OperationDto['responseInbound']>;
    outbound(dto: OperationDto['requestOutbound'], session: SessionUser): Promise<OperationDto['responseOutbound']>;
    specialOutbound(dto: OperationDto['requestSpecialOutbound'], session: SessionUser): Promise<OperationDto['responseSpecialOutbound']>;
    private buildOperationQuery;
    private mapOperation;
    show(dto: OperationDto['requestShow'], session: SessionUser): Promise<OperationDto['responseShow']>;
    showAll(dto: OperationDto['requestShowAll'], session: SessionUser): Promise<OperationDto['responseShowAll']>;
    update(dto: OperationDto['requestUpdate'], session: SessionUser): Promise<OperationDto['responseUpdate']>;
    del(dto: OperationDto['requestDel'], session: SessionUser): Promise<OperationDto['responseDel']>;
}
