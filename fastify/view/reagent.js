import prisma from '../prisma/script.js';
const reagent_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            specifications: { type: 'string' },
            warn_number: { type: 'number' },
            price: { type: 'number' },
            teamid: { type: 'number' },
            warn_days: { type: 'number' },
            storage_condition: { type: 'string' },
            using: { type: 'boolean' },
        },
        required: ['name', 'specifications', 'warn_number', 'price', 'teamid', 'warn_days', 'storage_condition', 'using']
    }
};
const reagent_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            teamid: { type: 'number' },
            name: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' }
        },
        required: ['teamid', 'page', 'pagesize']
    }
};
const reagent_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            specifications: { type: 'string' },
            warn_number: { type: 'number' },
            price: { type: 'number' },
            storage_condition: { type: 'string' },
            teamid: { type: 'number' },
            warn_days: { type: 'number' },
            using: { type: 'boolean' },
        },
        required: ['id', 'name', 'specifications', 'warn_number', 'price', 'storage_condition', 'teamid', 'warn_days', 'using']
    }
};
const reagent_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        required: ['id']
    }
};
const reagent_showall_schema = {
    querystring: {
        type: 'object',
        properties: {
            teamid: { type: 'number' }
        }
    }
};
export { reagent_add_schema, reagent_show_schema, reagent_update_schema, reagent_del_schema, reagent_showall_schema };


async function reagent_add(request, reply) {
    const { name, specifications, warn_number, price, storage_condition, teamid, warn_days, using, generate_lot } = request.body;
    const add = await prisma.reagent.create({
        data: { name, specifications, warn_number, price, storage_condition, teamid, warn_days, using }
    });
    if (generate_lot) {
        const addlot = await prisma.lot.create({
            data: { name: "默认" + add.name + "批号", expiration_date: "2030-06-06T11:26:38.805Z", using: true, reagentid: add.id }
        });
    }
    return { status: 0, msg: "成功", data: add };
}
async function reagent_show(request, reply) {
    const { teamid, name, page, pagesize } = request.query;
    const where = {
        using: true,
    };
    if (name !== "") {
        where.name = { contains: name };
    }
    const show = await prisma.reagent.findMany({
        where: where,
        skip: (page - 1) * pagesize,
        take: pagesize,
        orderBy: { id: 'desc' }
    });
    return { status: 0, msg: "成功", data: show, total: show.length, page: page, pagesize: pagesize };
}
async function reagent_update(request, reply) {
    const { id, name, specifications, warn_number, price, storage_condition, teamid, warn_days, using } = request.body;
    const update = await prisma.reagent.update({
        where: { id },
        data: { name, specifications, warn_number, price, storage_condition, teamid, warn_days, using }
    });
    return { status: 0, msg: "成功", data: update };
}
async function reagent_del(request, reply) {
    const { id } = request.body;
    const del = await prisma.reagent.update({
        where: { id },
        data: { using: false }
    });
    return { status: 0, msg: "成功", data: del };
}
async function reagent_showall(request, reply) {
    const { teamid } = request.query;
    const showall = await prisma.reagent.findMany({
        where: { teamid: teamid },
        select: {
            id: true,
            name: true,
        },
        orderBy: { id: 'desc' }
    });
    return { status: 0, msg: "成功", data: showall };
}
export { reagent_add, reagent_show, reagent_update, reagent_del, reagent_showall };
