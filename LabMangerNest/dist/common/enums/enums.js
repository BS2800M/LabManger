"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationAction = exports.UserRole = exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["Enable"] = 0] = "Enable";
    Status[Status["Disable"] = 1] = "Disable";
    Status[Status["Delete"] = 2] = "Delete";
})(Status || (exports.Status = Status = {}));
var UserRole;
(function (UserRole) {
    UserRole[UserRole["Member"] = 0] = "Member";
    UserRole[UserRole["Leader"] = 1] = "Leader";
    UserRole[UserRole["Director"] = 2] = "Director";
    UserRole[UserRole["Admin"] = 3] = "Admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var OperationAction;
(function (OperationAction) {
    OperationAction[OperationAction["NoInfo"] = 0] = "NoInfo";
    OperationAction[OperationAction["Inbound"] = 1] = "Inbound";
    OperationAction[OperationAction["Outbound"] = 2] = "Outbound";
})(OperationAction || (exports.OperationAction = OperationAction = {}));
//# sourceMappingURL=enums.js.map