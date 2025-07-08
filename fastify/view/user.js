import prisma from '../prisma/script.js';
import crypto from 'crypto';
import { role_permissions } from '../plugin/permission.js';
async function user_add(request, reply) {
    let { username, password, role, teamid } = request.body;
    const password_sha256 = crypto.createHash('sha256').update(password).digest('hex');
    const now_level = role_permissions[request.role].level;
    const create_user_level = role_permissions[role].level;
    if (now_level >= create_user_level) { //如果当前用户的权限大于要创建的用户的权限，则不能创建
        return reply.code(403).send({
            status: 1,
            msg: "不能创建比自己权限大的用户",
        });
    }
    const user = await prisma.user.create({
        data: {
            username,
            password: password_sha256,
            role,
            using: true,
            teamid: teamid
        }
    });
    return {
        status: 0,
        msg: "成功添加用户",
    };
}
async function user_del(request, reply) {
    const { id } = request.body;
    const now_level = role_permissions[request.role].level;
    const find_id_level = await prisma.user.findUnique({
        where: { id },
        select: { role: true }
    });
    const delete_user_level = role_permissions[find_id_level.role].level; //获取要删除的用户的角色等级
    if (now_level >= delete_user_level) { //如果当前用户的权限大于要删除的用户的权限，则不能删除
        return reply.code(403).send({
            status: 1,
            msg: "不能删除比自己权限大的用户",
        });
    }
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            using: false
        }
    });
    return {
        status: 0,
        msg: "成功删除用户",
    };
}
async function user_show(request, reply) {
    const { name, page, pagesize } = request.query;
    const where = { using: true,
        ...request.validate_where };
    if (name !== "") {
        where.username = {
            contains: name
        };
    }
    console.log(where);
    const total = await prisma.user.count({ where });
    const usersdata = await prisma.user.findMany({
        skip: (page - 1) * pagesize,
        take: pagesize,
        orderBy: { id: 'desc' },
        where,
        select: {
            id: true,
            username: true,
            role: true,
            team: {
                select: {
                    name: true
                }
            },
            teamid: true,
            using: true
        }
    });
    const transoformerdata = usersdata.map((user) => {
        return {
            id: user.id,
            teamname: user.team.name,
            role: user.role,
            using: user.using,
            username: user.username,
            teamid: user.teamid,
            rolename: role_permissions[user.role].description
        };
    });
    return {
        status: 0,
        msg: "成功",
        data: transoformerdata,
        total: total,
        page: page,
        pagesize: pagesize,
        totalpages: Math.ceil(total / pagesize)
    };
}
async function user_update(request, reply) {
    const { id, username, role, teamid, password } = request.body;
    const password_sha256 = crypto.createHash('sha256').update(password).digest('hex');
    const now_level = role_permissions[request.role].level;
    const find_id_level = await prisma.user.findUnique({
        where: { id },
        select: { role: true }
    });
    const update_user_level = role_permissions[find_id_level.role].level; //获取要修改的用户的角色等级
    if (now_level >= update_user_level) { //如果当前用户的权限大于要修改的用户的权限，则不能修改
        return reply.code(403).send({
            status: 1,
            msg: "不能修改比自己权限大的用户",
        });
    }
    const user = await prisma.user.update({
        where: { id },
        data: { username, role, teamid, password: password_sha256 }
    });
    return {
        status: 0,
        msg: "成功"
    };
}
export { user_add, user_del, user_show, user_update };
