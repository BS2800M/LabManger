import prisma from '../prisma/script.js';
async function team_add(request, reply) {
    const { name, phone, note } = request.body;
    const add = await prisma.team.create({
        data: {
            name: name,
            phone: phone,
            note: note,
            using: true
        }
    });
    return { status: 0, msg: "成功", data: add };
}
async function team_show(request, reply) {
    let { name, page, pagesize } = request.query;
    // 构建查询条件
    const where = { using: true };
    if (name !== "") {
        where.name = { contains: name };
    }
    // 获取总数
    const total = await prisma.team.count({ where });
    // 获取分页数据
    const show = await prisma.team.findMany({
        where,
        skip: (page - 1) * pagesize,
        take: pagesize,
        orderBy: { id: 'desc' }
    });
    return {
        status: 0,
        msg: "成功",
        data: show,
        total: total, // 使用 count 查询的结果
        page: page,
        pagesize: pagesize,
        totalpages: Math.ceil(total / pagesize) // 使用总数计算总页数
    };
}
async function team_update(request, reply) {
    const { id, name, phone, note, using } = request.body;
    const update = await prisma.team.update({
        where: { id },
        data: {
            name: name,
            phone: phone,
            note: note,
            using: using
        }
    });
    return { status: 0, msg: "成功", data: update };
}
async function team_del(request, reply) {
    const { id } = request.body;
    const del = await prisma.team.update({
        where: {
            id: id
        },
        data: {
            using: false
        }
    });
    return { status: 0, msg: "成功", data: del };
}
export { team_add, team_show, team_update, team_del };
