import prisma from '../prisma/script.js';
async function lot_add(request, reply) {
    const { name, reagentid, expiration_date, using } = request.body;
    const add = await prisma.lot.create({
        data: { name, reagentid, expiration_date, using }
    });
    let warn_days = await prisma.reagent.findUnique({
        where: { id: reagentid },
        select: {
            warn_days: true
        }
    });
    warn_days = warn_days.warn_days; //将warn_days转换为数字
    await prisma.inventory.create({
        data: {
            reagentid: reagentid,
            lotid: add.id,
            inventory_number: 0,
            last_outbound_time: new Date(),
            lastweek_outbound_number: 0,
            using: true
        }
    });
    return { status: 0, msg: "成功", data: add };
}
async function lot_show(request, reply) {
    const { reagentname, page, pagesize } = request.query;
    const teamid = request.teamid;
    const where = {
        using: true,
        reagent: {
            teamid: teamid
        }
    };
    if (reagentname !== "") {
        where.reagent.name = { contains: reagentname };
    }
    const total = await prisma.lot.count({ where }); //获取总数
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
    return { status: 0, msg: "成功", data: transformed_show, total: total, page: page, pagesize: pagesize, totalpages: Math.ceil(total / pagesize) };
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
    await prisma.inventory.updateMany({
        where: { lotid: id },
        data: { using: false }
    });
    return { status: 0, msg: "成功", data: del };
}
async function lot_showall(request, reply) {
    const { reagentid } = request.query;
    const showall = await prisma.lot.findMany({
        where: { reagentid: reagentid, using: true },
        select: {
            id: true,
            name: true,
        },
        orderBy: { id: 'desc' }
    });
    return { status: 0, msg: "成功", data: showall };
}
export { lot_add, lot_show, lot_update, lot_del, lot_showall };
