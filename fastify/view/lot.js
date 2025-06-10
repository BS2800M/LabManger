import prisma from '../prisma/script.js';
const lot_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            reagentid: { type: 'number' },
            expiration_date: { type: 'string' },
            using: { type: 'boolean' },
        },
        required: ['name', 'reagentid', 'expiration_date', 'using']
    }
};
const lot_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            reagentname: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' },
        }
    }
};
const lot_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            reagentid: { type: 'number' },
            expiration_date: { type: 'string' },
            using: { type: 'boolean' },
        },
        required: ['id', 'name', 'reagentid', 'expiration_date', 'using']
    }
};
const lot_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }
};
const lot_showall_schema = {
    querystring: {
        type: 'object',
        properties: {
            reagentid: { type: 'number' },
        }
    }
};
export { lot_add_schema, lot_show_schema, lot_update_schema, lot_del_schema, lot_showall_schema };
async function lot_add(request, reply) {
    const { name, reagentid, expiration_date, using } = request.body;
    const add = await prisma.lot.create({
        data: { name, reagentid, expiration_date, using }
    });
    return { status: 0, msg: "成功", data: add };
}
async function lot_show(request, reply) {
    const { reagentname, page, pagesize } = request.query;
    const where = {
        using: true,
    };
    if (reagentname !== "") {
        where.reagent = { name: { contains: reagentname } };
    }
    const show = await prisma.lot.findMany({
        where: where,
        skip: (page - 1) * pagesize,
        take: pagesize,
        include: {
            reagent: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { id: 'desc' }
    });
    const transformed_show = show.map((item) => {
        return {
            id: item.id,
            name: item.name,
            expiration_date: item.expiration_date,
            creation_time: item.creation_time,
            reagentid: item.reagentid,
            reagentname: item.reagent.name,
            using: item.using
        };
    });
    return { status: 0, msg: "成功", data: transformed_show, total: transformed_show.length, page: page, pagesize: pagesize };
}
async function lot_update(request, reply) {
    const { id, name, reagentid, expiration_date, using } = request.body;
    const update = await prisma.lot.update({
        where: { id },
        data: { name, reagentid, expiration_date, using }
    });
    return { status: 0, msg: "成功", data: update };
}
async function lot_del(request, reply) {
    const { id } = request.body;
    const del = await prisma.lot.update({
        where: { id },
        data: { using: false }
    });
    return { status: 0, msg: "成功", data: del };
}
async function lot_showall(request, reply) {
    const { reagentid } = request.query;
    const showall = await prisma.lot.findMany({
        where: { reagentid: reagentid },
        select: {
            id: true,
            name: true,
        },
        orderBy: { id: 'desc' }
    });
    return { status: 0, msg: "成功", data: showall };
}
export { lot_add, lot_show, lot_update, lot_del, lot_showall };
