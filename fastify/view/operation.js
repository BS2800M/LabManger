import prisma from '../prisma/script.js';

async function inbound(request, reply) {
    const { inboundlist } = request.body;
    let addlist = [];
    let addid = await prisma.operation.aggregate({
        _max: {
            id: true
        }
    });
    if (addid._max.id == null) {
        addid._max.id = 0;
    }
    let startid = addid._max.id + 1;
    let nowid = startid;
    inboundlist.map(async (item) => {
        for (let i = 0; i < item.number; i++) {
            addlist.push({
                id: nowid,
                reagentid: item.reagentid,
                lotid: item.lotid,
                operation_action: "inbound",
                using: true,
                barcodenumber: (nowid + 1000000).toString(),
                username: item.username,
            });
            nowid = nowid + 1;
        }
    });
    await prisma.operation.createMany({
        data: addlist
    });
    const resultlist = await prisma.operation.findMany({
        where: {
            id: {
                gte: startid,
                lte: nowid
            }
        },
        include: {
            reagent: {
                select: {
                    name: true,
                }
            },
            lot: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            id: "asc"
        }
    });
    const transformed_show = resultlist.map((item) => {
        return {
            id: item.id,
            reagentid: item.reagentid,
            lotid: item.lotid,
            reagentname: item.reagent.name,
            lotname: item.lot.name,
            barcodenumber: item.barcodenumber,
            operation_action: item.operation_action,
            using: item.using,
            username: item.username,
        };
    });
    return { status: 0, msg: "入库成功", data: transformed_show };
}
async function outbound(request, reply) {
    const { barcodenumber } = request.body;
    let result = await prisma.operation.count({
        where: { barcodenumber: barcodenumber },
    });
    if (result == 0) {
        return { status: 1, msg: "条码不存在" };
    }
    if (result == 1) {
        const search = await prisma.operation.findFirst({
            where: { barcodenumber: barcodenumber }
        });
        const outbound = await prisma.operation.create({
            data: {
                reagentid: search.reagentid,
                lotid: search.lotid,
                operation_action: "outbound",
                using: true,
                barcodenumber: barcodenumber,
                username: search.username,
            }
        });
        return { status: 0, msg: "出库成功" };
    }
    if (result > 1) {
        return { status: 1, msg: "已经出库" };
    }
}
async function special_outbound(request, reply) {
    const { reagentid, lotid, number, username } = request.body;
    let addlist = [];
    let result = await prisma.operation.count({
        where: { reagentid: reagentid, lotid: lotid },
    });
    if (result < number) {
        return { status: 1, msg: "库存不足" };
    }
    for (let i = 0; i < number; i++) {
        addlist.push({
            reagentid: reagentid,
            lotid: lotid,
            operation_action: "s_outbound",
            using: true,
            barcodenumber: "unknown",
            username: username,
        });
    }
    await prisma.operation.createMany({
        data: addlist
    });
    return { status: 0, msg: "出库成功" };
}
async function operation_show(request, reply) {
    const { teamid, reagentname, searchlater, searchearlier, barcodenumber, pagesize, page } = request.query;
    console.log(request.query);
    const where = {
        using: true,
        reagent: {
            teamid: teamid,
        }
    };
    if (searchlater != "") {
        where.creation_time = { gte: searchlater, lte: searchearlier };
    }
    if (barcodenumber != "") {
        where.barcodenumber = { contains: barcodenumber };
    }
    if (reagentname != "") {
        where.reagentname = { contains: reagentname };
    }
    const show = await prisma.operation.findMany({
        where: where,
        include: {
            reagent: {
                select: {
                    name: true,
                }
            },
            lot: {
                select: {
                    name: true,
                }
            },
        },
        skip: (page - 1) * pagesize,
        take: pagesize,
        orderBy: {
            id: "desc"
        }
    });
    const transformed_show = show.map((item) => {
        return {
            id: item.id,
            reagentid: item.reagentid,
            lotid: item.lotid,
            reagentname: item.reagent.name,
            lotname: item.lot.name,
            barcodenumber: item.barcodenumber,
            operation_action: item.operation_action,
            using: item.using,
            username: item.username,
        };
    });
    return { status: 0, msg: "成功", data: transformed_show, total: transformed_show.length, page: page, pagesize: pagesize };
}
export { inbound, outbound, special_outbound, operation_show };
