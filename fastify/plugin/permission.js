import fp from 'fastify-plugin';
const role_permissions = {
    admin: {
        description: "管理员",
        level: 0,
        permissions: [
            "team_add",
            "team_show",
            "team_update",
            "team_del",
            "reagent_add",
            "reagent_show",
            "reagent_update",
            "reagent_del",
            "reagent_showall",
            "lot_add",
            "lot_show",
            "lot_update",
            "lot_del",
            "lot_showall",
            "inbound",
            "outbound",
            "special_outbound",
            "operation_show",
            "operation_del",
            "operation_show_exportToExcel",
            "inventory_show",
            "inventory_audit",
            "user_add",
            "user_del",
            "user_show",
            "user_update",
        ]
    },
    director: {
        description: "主任",
        level: 1,
        permissions: [
            "team_add",
            "team_show",
            "team_update",
            "team_del",
            "reagent_add",
            "reagent_show",
            "reagent_update",
            "reagent_del",
            "reagent_showall",
            "lot_add",
            "lot_show",
            "lot_update",
            "lot_del",
            "lot_showall",
            "inbound",
            "outbound",
            "special_outbound",
            "operation_show",
            "operation_del",
            "operation_show_exportToExcel",
            "inventory_show",
            "inventory_audit",
            "user_add",
            "user_del",
            "user_show",
            "user_update",
        ]
    },
    team_leader: {
        description: "组长",
        level: 2,
        permissions: [
            "team_show",
            "reagent_add",
            "reagent_show",
            "reagent_update",
            "reagent_del",
            "reagent_showall",
            "lot_add",
            "lot_show",
            "lot_update",
            "lot_del",
            "lot_showall",
            "inbound",
            "outbound",
            "special_outbound",
            "operation_show",
            "operation_del",
            "operation_show_exportToExcel",
            "inventory_show",
            "inventory_audit",
            "user_add",
        ]
    },
    user: {
        description: "组员",
        level: 3,
        permissions: [
            "team_show",
            "reagent_show",
            "reagent_showall",
            "lot_add",
            "lot_show",
            "lot_update",
            "lot_del",
            "lot_showall",
            "inbound",
            "outbound",
            "special_outbound",
            "operation_show",
            "operation_show_exportToExcel",
            "inventory_show",
        ]
    }
};
function check_permission_func(action) {
    return async function (request, reply) {
        const role = request.role;
        if (role_permissions[role].permissions.includes(action) == false) {
            return reply.status(403).send({ status: 1, msg: "权限不足" });
        }
    };
}
async function check_permission(fastify, options) {
    fastify.decorate('check_permission', function (action) {
        return check_permission_func(action);
    });
}
export default fp(check_permission);
export { role_permissions };
