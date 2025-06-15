import prisma from '../prisma/script.js';
import { inventory_update_list } from './inventory.js';
async function inbound(request, reply) {
    const { inboundlist } = request.body;
    const userid = request.userid;
    let addlist = [];
    let addid = await prisma.operation.aggregate({
        _max: {
            id: true
        }
    });
    if (addid._max.id == null) { //如果当前操作记录的最大id为null，则设置为0
        addid._max.id = 0;
    }
    let startid = addid._max.id + 1; //设置开始id
    let nowid = startid; //设置当前id
    for (const item of inboundlist) { //遍历入库列表
        for (let i = 0; i < item.number; i++) { //遍历入库数量
            addlist.push({
                id: nowid,
                reagentid: item.reagentid,
                lotid: item.lotid,
                operation_action: "inbound",
                using: true,
                barcodenumber: (nowid + 1000000).toString(),
                userid: userid,
            });
            nowid = nowid + 1; //更新当前id
        }
    }
    const { returnmsg, list } = await inventory_update_list(inboundlist); //更新库存
    await prisma.operation.createMany({
        data: addlist
    });
    const include = {
        reagent: {
            select: {
                name: true,
            }
        },
        lot: {
            select: {
                name: true,
            }
        }
    };
    const resultlist = await prisma.operation.findMany({
        where: {
            id: {
                gte: startid,
                lte: nowid
            }
        },
        include: include,
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
            userid: item.userid,
        };
    });
    return { status: 0, msg: returnmsg, data: transformed_show };
}
async function outbound(request, reply) {
    const { barcodenumber } = request.body;
    const userid = request.userid;
    let returnmsg = "";
    let result = await prisma.operation.count({
        where: { barcodenumber: barcodenumber },
    });
    if (result == 0) {
        return reply.status(200).send({ status: 1, msg: "条码不存在" });
    }
    if (result > 1) {
        return reply.status(200).send({ status: 1, msg: "已经出库" });
    }
    if (result == 1) {
        const search = await prisma.operation.findFirst({
            where: { barcodenumber: barcodenumber }
        });
        const { returnmsg, list } = await inventory_update_list([{ reagentid: search.reagentid, lotid: search.lotid, number: -1, userid: userid }]); //更新库存
        await prisma.operation.create({
            data: {
                reagentid: search.reagentid,
                lotid: search.lotid,
                operation_action: "outbound",
                using: true,
                barcodenumber: barcodenumber,
                userid: userid,
            }
        });
        return { status: 0, msg: returnmsg };
    }
}
async function special_outbound(request, reply) {
    let { outboundlist } = request.body;
    const userid = request.userid;
    for (const item of outboundlist) {
        item.number = item.number * (-1); //负数代表出库 减少库存
    }
    const { returnmsg, list } = await inventory_update_list(outboundlist); //更新库存 返回信息提示和过滤后的更新列表
    let addlist = [];
    for (const item of list) {
        for (let i = 0; i < -(item.number); i++) { //出库数量为负数 所以需要取反
            addlist.push({
                reagentid: item.reagentid,
                lotid: item.lotid,
                operation_action: "special_outbound",
                using: true,
                barcodenumber: "unknown",
                userid: userid,
            });
        }
    }
    await prisma.operation.createMany({
        data: addlist
    });
    return { status: 0, msg: returnmsg };
}
async function operation_show(request, reply) {
    const { reagentname, searchlater, searchearlier, barcodenumber, pagesize, page } = request.query;
    const teamid = request.teamid;
    const where = {
        using: true,
        reagent: {
            teamid: teamid,
        }
    };
    if (searchlater != "" || searchearlier != "") {
        where.creation_time = {};
        if (searchlater != "") { //如果搜索时间范围不为空，则设置时间范围
            where.creation_time.gte = searchlater;
        }
        if (searchearlier != "") {
            where.creation_time.lte = searchearlier;
        }
    }
    if (barcodenumber != "") { //如果条码不为空，则设置条码
        where.barcodenumber = { contains: barcodenumber };
    }
    if (reagentname != "") { //如果试剂名称不为空，则设置试剂名称
        where.reagent.name = { contains: reagentname };
    }
    const include = {
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
        user: {
            select: {
                username: true,
            }
        }
    };
    const total = await prisma.operation.count({ where }); //获取总数
    const show = await prisma.operation.findMany({
        where: where,
        include: include,
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
            userid: item.userid,
            username: item.user.username,
            creation_time: item.creation_time,
        };
    });
    return { status: 0, msg: "成功", data: transformed_show, total: total, page: page, pagesize: pagesize, totalpages: Math.ceil(total / pagesize) };
}
async function operation_del(request, reply) {
    const { id } = request.body;
    const del = await prisma.operation.update({
        where: { id: id },
        data: {
            using: false
        }
    });
    if (del.operation_action == "inbound") { //如果删除的是入库
        await inventory_update_list([{ reagentid: del.reagentid, lotid: del.lotid, number: 1 }]); //更新库存
    }
    if (del.operation_action == "outbound" || del.operation_action == "special_outbound") { //如果删除的是出库
        await inventory_update_list([{ reagentid: del.reagentid, lotid: del.lotid, number: -1 }]); //更新库存
    }
    return { status: 0, msg: "成功", data: del };
}
async function operation_show_exportToExcel(request, reply) {
    const teamid = request.teamid;
    const operationlist = await prisma.operation.findMany({
        where: {
            reagent: {
                teamid: teamid,
            },
            using: true
        },
        orderBy: {
            creation_time: "asc"
        },
        select: {
            creation_time: true,
            operation_action: true,
            user: {
                select: {
                    username: true
                }
            },
            reagent: {
                select: {
                    id: true,
                    name: true,
                    storage_condition: true,
                    specifications: true,
                }
            },
            lot: {
                select: {
                    id: true,
                    name: true,
                    expiration_date: true,
                }
            },
        }
    });
    let merged_list = []; //合并操作记录 时间相差少的记录合并在一起
    for (let i = 0; i < operationlist.length; i++) {
        const current = operationlist[i];
        if (merged_list.length === 0) {
            // 第一个元素直接添加，设置count为1
            if (current.operation_action == "inbound") {
                current.inbound_number = 1;
            }
            else if (current.operation_action == "outbound" || current.operation_action == "special_outbound") {
                current.outbound_number = 1;
            }
            merged_list.push(current);
        }
        else {
            const lastItem = merged_list[merged_list.length - 1];
            const timeDiff = Math.abs(new Date(current.creation_time).getTime() - new Date(lastItem.creation_time).getTime());
            const fiveSeconds = 5 * 1000; // 5秒的毫秒数.
            if (timeDiff < fiveSeconds && current.reagent.id == lastItem.reagent.id && current.lot.id == lastItem.lot.id) {
                // 时间差少于5秒并且是同一试剂 同一个批号，增加count计数
                if (current.operation_action == "inbound") {
                    lastItem.inbound_number = (lastItem.inbound_number || 0) + 1;
                }
                if (current.operation_action == "outbound" || current.operation_action == "special_outbound") {
                    lastItem.outbound_number = (lastItem.outbound_number || 0) + 1;
                }
            }
            else {
                // 时间差大于等于5秒，添加新元素
                if (current.operation_action == "inbound") {
                    current.inbound_number = 1;
                }
                if (current.operation_action == "outbound" || current.operation_action == "special_outbound") {
                    current.outbound_number = 1;
                }
                merged_list.push(current);
            }
        }
    }
    let transformed_list = merged_list.map((item, index) => {
        return {
            creation_time: item.creation_time,
            operation_action: item.operation_action,
            reagentname: item.reagent.name,
            lotname: item.lot.name,
            lotexpiration_date: item.lot.expiration_date,
            inbound_number: item.inbound_number || 0,
            outbound_number: item.outbound_number || 0,
            inventory_number: item.inbound_number - item.outbound_number || 0,
            reagentid: item.reagent.id,
            lotid: item.lot.id,
            storage_condition: item.reagent.storage_condition,
            username: item.user.username,
            specifications: item.reagent.specifications,
        };
    });
    transformed_list = transformed_list.map((item, index) => {
        item.inventory_number = 0;
        for (let i = 0; i <= index; i++) {
            if (transformed_list[i].reagentid == item.reagentid && transformed_list[i].lotid == item.lotid) {
                item.inventory_number += transformed_list[i].inbound_number - transformed_list[i].outbound_number;
            }
        }
        return item;
    });
    let result_list = []; //整合 每种试剂的操作记录放到一个列表里里并且去重
    // 使用Map来去重，key为reagentid
    let reagentMap = new Map();
    for (let i = 0; i < transformed_list.length; i++) {
        const currentItem = transformed_list[i];
        const reagentId = currentItem.reagentid;
        if (!reagentMap.has(reagentId)) {
            // 如果这个试剂ID还没有，创建新的试剂记录
            reagentMap.set(reagentId, {
                reagentid: currentItem.reagentid,
                reagentname: currentItem.reagentname,
                storage_condition: currentItem.storage_condition,
                operationlist: []
            });
        }
        // 获取当前试剂的操作列表
        const currentReagent = reagentMap.get(reagentId);
        // 检查这个操作记录是否已经存在（通过时间、批号、入库数量、出库数量来判断）
        const operationExists = currentReagent.operationlist.some((op) => op.creation_time === currentItem.creation_time &&
            op.lotid === currentItem.lotid &&
            op.inbound_number === currentItem.inbound_number &&
            op.outbound_number === currentItem.outbound_number);
        if (!operationExists) {
            // 如果操作记录不存在，添加它
            currentReagent.operationlist.push({
                creation_time: currentItem.creation_time,
                lotid: currentItem.lotid,
                lotname: currentItem.lotname,
                lotexpiration_date: currentItem.lotexpiration_date,
                inventory_number: currentItem.inventory_number,
                inbound_number: currentItem.inbound_number,
                outbound_number: currentItem.outbound_number,
                username: currentItem.username,
                specifications: currentItem.specifications,
            });
        }
    }
    // 将Map转换为数组
    result_list = Array.from(reagentMap.values());
    return { status: 0, msg: "成功", data: result_list };
}
export { inbound, outbound, special_outbound, operation_show, operation_del, operation_show_exportToExcel };
