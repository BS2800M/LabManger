import prisma from '../prisma/script.js';
//规定json数据验证
const team_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            note: { type: 'string' },
            using: { type: 'boolean' }
        },
        required: ['name', 'phone', 'using']
    }
};
const team_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' }
        },
        required: ['name', 'page', 'pagesize']
    }
};
const team_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            phone: { type: 'string' },
            note: { type: 'string' },
            using: { type: 'boolean' }
        },
        required: ['id', 'name', 'phone', 'using']
    }
};
const team_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
    }
};
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
    const skip = (page - 1) * pagesize;
    // 构建查询条件
    const where = { using: true };
    if (name !== "") {
        where.name = { contains: name };
    }
    // 获取总数
    // 获取分页数据
    const show = await prisma.team.findMany({
        where,
        skip,
        take: pagesize,
        orderBy: { id: 'desc' }
    });
    return {
        status: 0,
        msg: "成功",
        data: show,
        total: show.length,
        page: page,
        pagesize: pagesize
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
export { team_add_schema, team_show_schema, team_update_schema, team_del_schema };
