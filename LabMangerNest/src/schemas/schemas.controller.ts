import { Controller, Get } from '@nestjs/common';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { AuthZod } from '../auth/auth.dto';
import { TeamZod } from '../team/team.dto';
import { UserZod } from '../user/user.dto';
import { ReagentZod } from '../reagent/reagent.dto';
import { LotZod } from '../lot/lot.dto';
import { OperationZod } from '../operation/operation.dto';
import { InventoryZod } from '../inventory/inventory.dto';
interface SchemaInfo {
  $schema: string;
  title: string;
  type: string;
  properties: Record<string, any>;
  required?: string[];
}

function generateSchemaFromZod(schema: any, title: string): SchemaInfo {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title,
    ...zodToJsonSchema(schema) as any,
  };
}

@Controller('schemas')
export class SchemasController {
  @Get()
  getAllSchemas() {
    return {
      team: {
        add: generateSchemaFromZod(TeamZod.requestAdd, 'RequestTeamAdd'),
        show: generateSchemaFromZod(TeamZod.requestShow, 'RequestTeamShow'),
        update: generateSchemaFromZod(TeamZod.requestUpdate, 'RequestTeamUpdate'),
        del: generateSchemaFromZod(TeamZod.requestDel, 'RequestTeamDel'),
      },
      auth: {
        signin: generateSchemaFromZod(AuthZod.requestSignin, 'RequestAuthSignin'),
        signout: generateSchemaFromZod(AuthZod.requestSignout, 'RequestAuthSignout'),
      },
      user: {
        add: generateSchemaFromZod(UserZod.requestAdd, 'RequestUserAdd'),
        show: generateSchemaFromZod(UserZod.requestShow, 'RequestUserShow'),
        update: generateSchemaFromZod(UserZod.requestUpdate, 'RequestUserUpdate'),
        del: generateSchemaFromZod(UserZod.requestDel, 'RequestUserDel'),
      },
      reagent: {
        add: generateSchemaFromZod(ReagentZod.requestAdd, 'RequestReagentAdd'),
        show: generateSchemaFromZod(ReagentZod.requestShow, 'RequestReagentShow'),
        update: generateSchemaFromZod(ReagentZod.requestUpdate, 'RequestReagentUpdate'),
        del: generateSchemaFromZod(ReagentZod.requestDel, 'RequestReagentDel'),
      },
      operation: {
        inbound: generateSchemaFromZod(OperationZod.requestInbound, 'RequestOperationInbound'),
        outbound: generateSchemaFromZod(OperationZod.requestOutbound, 'RequestOperationOutbound'),
        specialOutbound: generateSchemaFromZod(OperationZod.requestSpecialOutbound, 'RequestOperationSpecialOutbound'),
        show: generateSchemaFromZod(OperationZod.requestShow, 'RequestOperationShow'),
        update: generateSchemaFromZod(OperationZod.requestUpdate, 'RequestOperationUpdate'),
        del: generateSchemaFromZod(OperationZod.requestDel, 'RequestOperationDel'),
      },
      lot: {
        add: generateSchemaFromZod(LotZod.requestAdd, 'RequestLotAdd'),
        show: generateSchemaFromZod(LotZod.requestShow, 'RequestLotShow'),
        update: generateSchemaFromZod(LotZod.requestUpdate, 'RequestLotUpdate'),
        del: generateSchemaFromZod(LotZod.requestDel, 'RequestLotDel'),
        showAll: generateSchemaFromZod(LotZod.requestShowAll, 'RequestLotShowAll'),
      },
      inventory: {
        show: generateSchemaFromZod(InventoryZod.requestShow, 'RequestInventoryShow'),
        auditAll: generateSchemaFromZod(InventoryZod.requestAuditAll, 'RequestInventoryAuditAll'),
        statistics: generateSchemaFromZod(InventoryZod.requestStatistics, 'RequestInventoryStatistics'),
      },
    }
  }
}
