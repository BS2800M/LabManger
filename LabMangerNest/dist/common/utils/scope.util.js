"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamScope = teamScope;
const enums_1 = require("../enums/enums");
function teamScope(session) {
    if (session.role >= enums_1.UserRole.Director)
        return {};
    return { teamId: session.teamId };
}
//# sourceMappingURL=scope.util.js.map