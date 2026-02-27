"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const team_module_1 = require("./team/team.module");
const user_module_1 = require("./user/user.module");
const reagent_module_1 = require("./reagent/reagent.module");
const lot_module_1 = require("./lot/lot.module");
const operation_module_1 = require("./operation/operation.module");
const inventory_module_1 = require("./inventory/inventory.module");
const init_module_1 = require("./common/init/init.module");
const schemas_module_1 = require("./schemas/schemas.module");
const session_guard_1 = require("./common/guards/session.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, team_module_1.TeamModule, user_module_1.UserModule, reagent_module_1.ReagentModule, lot_module_1.LotModule, operation_module_1.OperationModule, inventory_module_1.InventoryModule, init_module_1.InitModule, schemas_module_1.SchemasModule],
        controllers: [],
        providers: [
            { provide: core_1.APP_GUARD, useClass: session_guard_1.SessionGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map