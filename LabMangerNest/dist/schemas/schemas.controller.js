"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemasController = void 0;
const common_1 = require("@nestjs/common");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const auth_dto_1 = require("../auth/auth.dto");
const team_dto_1 = require("../team/team.dto");
const user_dto_1 = require("../user/user.dto");
const reagent_dto_1 = require("../reagent/reagent.dto");
const lot_dto_1 = require("../lot/lot.dto");
const operation_dto_1 = require("../operation/operation.dto");
const inventory_dto_1 = require("../inventory/inventory.dto");
function generateSchemaFromZod(schema, title) {
    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title,
        ...(0, zod_to_json_schema_1.zodToJsonSchema)(schema),
    };
}
let SchemasController = class SchemasController {
    getAllSchemas() {
        return {
            team: {
                add: generateSchemaFromZod(team_dto_1.TeamZod.requestAdd, 'RequestTeamAdd'),
                show: generateSchemaFromZod(team_dto_1.TeamZod.requestShow, 'RequestTeamShow'),
                update: generateSchemaFromZod(team_dto_1.TeamZod.requestUpdate, 'RequestTeamUpdate'),
                del: generateSchemaFromZod(team_dto_1.TeamZod.requestDel, 'RequestTeamDel'),
            },
            auth: {
                signin: generateSchemaFromZod(auth_dto_1.AuthZod.requestSignin, 'RequestAuthSignin'),
                signout: generateSchemaFromZod(auth_dto_1.AuthZod.requestSignout, 'RequestAuthSignout'),
            },
            user: {
                add: generateSchemaFromZod(user_dto_1.UserZod.requestAdd, 'RequestUserAdd'),
                show: generateSchemaFromZod(user_dto_1.UserZod.requestShow, 'RequestUserShow'),
                update: generateSchemaFromZod(user_dto_1.UserZod.requestUpdate, 'RequestUserUpdate'),
                del: generateSchemaFromZod(user_dto_1.UserZod.requestDel, 'RequestUserDel'),
            },
            reagent: {
                add: generateSchemaFromZod(reagent_dto_1.ReagentZod.requestAdd, 'RequestReagentAdd'),
                show: generateSchemaFromZod(reagent_dto_1.ReagentZod.requestShow, 'RequestReagentShow'),
                update: generateSchemaFromZod(reagent_dto_1.ReagentZod.requestUpdate, 'RequestReagentUpdate'),
                del: generateSchemaFromZod(reagent_dto_1.ReagentZod.requestDel, 'RequestReagentDel'),
            },
            operation: {
                inbound: generateSchemaFromZod(operation_dto_1.OperationZod.requestInbound, 'RequestOperationInbound'),
                outbound: generateSchemaFromZod(operation_dto_1.OperationZod.requestOutbound, 'RequestOperationOutbound'),
                specialOutbound: generateSchemaFromZod(operation_dto_1.OperationZod.requestSpecialOutbound, 'RequestOperationSpecialOutbound'),
                show: generateSchemaFromZod(operation_dto_1.OperationZod.requestShow, 'RequestOperationShow'),
                update: generateSchemaFromZod(operation_dto_1.OperationZod.requestUpdate, 'RequestOperationUpdate'),
                del: generateSchemaFromZod(operation_dto_1.OperationZod.requestDel, 'RequestOperationDel'),
            },
            lot: {
                add: generateSchemaFromZod(lot_dto_1.LotZod.requestAdd, 'RequestLotAdd'),
                show: generateSchemaFromZod(lot_dto_1.LotZod.requestShow, 'RequestLotShow'),
                update: generateSchemaFromZod(lot_dto_1.LotZod.requestUpdate, 'RequestLotUpdate'),
                del: generateSchemaFromZod(lot_dto_1.LotZod.requestDel, 'RequestLotDel'),
                showAll: generateSchemaFromZod(lot_dto_1.LotZod.requestShowAll, 'RequestLotShowAll'),
            },
            inventory: {
                show: generateSchemaFromZod(inventory_dto_1.InventoryZod.requestShow, 'RequestInventoryShow'),
                auditAll: generateSchemaFromZod(inventory_dto_1.InventoryZod.requestAuditAll, 'RequestInventoryAuditAll'),
                statistics: generateSchemaFromZod(inventory_dto_1.InventoryZod.requestStatistics, 'RequestInventoryStatistics'),
            },
        };
    }
};
exports.SchemasController = SchemasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchemasController.prototype, "getAllSchemas", null);
exports.SchemasController = SchemasController = __decorate([
    (0, common_1.Controller)('schemas')
], SchemasController);
//# sourceMappingURL=schemas.controller.js.map