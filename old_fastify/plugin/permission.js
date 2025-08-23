import fp from 'fastify-plugin';
import prisma from '../prisma/script.js';
// 权限配置
const role_permissions = {
    admin: {
        description: "管理员",
        level: 0,
        permissions: [
            { resource: 'team', actions: ['add', 'show', 'update', 'del'], scope: 'all' },
            { resource: 'reagent', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'all' },
            { resource: 'lot', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'all' },
            { resource: 'operation', actions: ['inbound', 'outbound', 'special_outbound', 'show', 'del', 'export'], scope: 'all' },
            { resource: 'inventory', actions: ['show', 'audit'], scope: 'all' },
            { resource: 'user', actions: ['add', 'show', 'update', 'del'], scope: 'all' },
        ]
    },
    director: {
        description: "主任",
        level: 1,
        permissions: [
            { resource: 'team', actions: ['add', 'show', 'update', 'del'], scope: 'all' },
            { resource: 'reagent', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'all' },
            { resource: 'lot', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'all' },
            { resource: 'operation', actions: ['inbound', 'outbound', 'special_outbound', 'show', 'del', 'export'], scope: 'all' },
            { resource: 'inventory', actions: ['show'], scope: 'all' },
            { resource: 'user', actions: ['add', 'show', 'update', 'del'], scope: 'all' },
        ]
    },
    team_leader: {
        description: "组长",
        level: 2,
        permissions: [
            { resource: 'team', actions: ['show'], scope: 'team' },
            { resource: 'reagent', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'team' },
            { resource: 'lot', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'team' },
            { resource: 'operation', actions: ['inbound', 'outbound', 'special_outbound', 'show', 'del', 'export'], scope: 'team' },
            { resource: 'inventory', actions: ['show'], scope: 'team' },
            { resource: 'user', actions: ['add', 'show', 'update', 'del'], scope: 'team' },
        ]
    },
    user: {
        description: "组员",
        level: 3,
        permissions: [
            { resource: 'team', actions: ['show'], scope: 'all' },
            { resource: 'reagent', actions: ['show', 'showall'], scope: 'team' },
            { resource: 'lot', actions: ['add', 'show', 'update', 'del', 'showall'], scope: 'team' },
            { resource: 'operation', actions: ['inbound', 'outbound', 'special_outbound', 'show', 'export'], scope: 'team' },
            { resource: 'inventory', actions: ['show'], scope: 'team' },
            { resource: 'user', actions: ['show', 'update'], scope: 'own' },
        ]
    }
};
// 根据权限范围创建数据访问条件
function createWhereClause(resource, scope, teamid, userid) {
    const where = {};
    switch (resource) {
        case 'reagent':
        case 'lot':
        case 'operation':
        case 'inventory':
            switch (scope) {
                case 'team':
                    where.teamid = teamid;
                    break;
                case 'own':
                    where.userid = userid;
                    break;
                case 'all': break; // 不添加任何限制
            }
            break;
        case 'user':
            switch (scope) {
                case 'team':
                    where.teamid = teamid;
                    break;
                case 'own':
                    where.id = userid;
                    break;
                case 'all': break; // 不添加任何限制
            }
            break;
    }
    return where;
}
// 检查资源所有权
async function checkOwnership(teamid, userid, scope, resource, resourceid) {
    let hasAccess = false;
    if (scope === 'all')
        return true;
    if (scope === 'team') {
        let result;
        switch (resource) {
            case 'reagent':
                result = await prisma.reagent.findUnique({
                    where: { id: resourceid },
                    select: { teamid: true }
                });
                result = result.teamid === teamid;
                break;
            case 'lot':
                result = await prisma.lot.findUnique({
                    where: { id: resourceid },
                    select: { reagent: { select: { teamid: true } } }
                });
                result = result.reagent.teamid === teamid;
                break;
            case 'operation':
                result = await prisma.operation.findUnique({
                    where: { id: resourceid },
                    select: { reagent: { select: { teamid: true } } }
                });
                result = result.reagent.teamid === teamid;
                break;
            case 'inventory':
                result = await prisma.inventory.findUnique({
                    where: { id: resourceid },
                    select: { lot: { select: { reagent: { select: { teamid: true } } } } }
                });
                result = result.lot.reagent.teamid === teamid;
                break;
            case 'user':
                result = await prisma.user.findUnique({
                    where: { id: resourceid },
                    select: { teamid: true }
                });
                result = result.teamid === teamid;
                break;
        }
        return result;
    }
    if (scope === 'own') {
        let result;
        switch (resource) {
            case 'user':
                result = await prisma.user.findUnique({
                    where: { id: resourceid },
                    select: { id: true }
                });
                result = result.id === userid;
                break;
        }
        return result;
    }
}
// 权限检查中间件
function createPermissionChecker(resource, action, mode) {
    return async function (request, reply) {
        const { role, teamid, userid } = request;
        const permissions = role_permissions[role]?.permissions || [];
        const permission = permissions.find((p) => p.resource === resource && p.actions.includes(action));
        if (!permission) {
            return reply.status(403).send({ status: 1, msg: "权限不足,没有对应的权限" });
        }
        request.validate_where = createWhereClause(resource, permission.scope, teamid, userid); //储存数据访问范围
        const scope = permission.scope;
        if (mode === 1) { //mode 为1是要检查资源所有权  为0则无需检查资源所有权
            const { id } = request.body;
            const { teamid, userid } = request;
            const resourceid = id;
            if (!await checkOwnership(teamid, userid, scope, resource, resourceid)) {
                return reply.status(403).send({ status: 1, msg: "权限不足,操作了规定范围外的数据" });
            }
        }
        return true;
    };
}
// 插件注册
async function check_permission(fastify, options) {
    fastify.decorate('check_permission', createPermissionChecker);
}
export default fp(check_permission);
export { role_permissions, checkOwnership };
