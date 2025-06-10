import prisma from '../prisma/script.js'
import { FastifyRequest } from 'fastify'
import { 
    ReagentAddRequestBody,
    ReagentShowRequestQuery,
    ReagentSearchParams,
    ReagentUpdateRequestBody,
    ReagentDelRequestBody,
    ReagentShowAllRequestQuery } from '../types/reagent.js'






async function reagent_add(request: FastifyRequest, reply: any) {
    const { name, specifications, warn_number, price, storage_condition, teamid, warn_days, using,generate_lot }:ReagentAddRequestBody = request.body as ReagentAddRequestBody
    const add = await prisma.reagent.create({
        data: { name, specifications, warn_number, price, storage_condition, teamid, warn_days, using }
    })
    if (generate_lot) {
        const addlot = await prisma.lot.create({ // 生成批号
            data: { name: "默认" + add.name + "批号", 
                expiration_date: "2030-06-06T11:26:38.805Z", 
                using: true, 
                reagentid: add.id }
        })
        const addinventory = await prisma.inventory.create({  // 生成库存
            data: { reagentid: add.id,
                lotid: addlot.id,
                inventory_number: 0,
                last_outbound_time: new Date(),
                lastweek_outbound_number: 0,
                using: true,
            }
        })
    }
    return {status:0,msg:"成功",data:add}
}

async function reagent_show(request: FastifyRequest, reply: any) {
    const { teamid, name, page, pagesize }:ReagentShowRequestQuery = request.query as ReagentShowRequestQuery
    const where:ReagentSearchParams = {
        using:true,
    }
    if(name!==""){
        where.name = {contains:name}
    }
    const total = await prisma.reagent.count({ where })
    const show = await prisma.reagent.findMany({
        where: where,
        skip: (page - 1) * pagesize,
        take: pagesize,
        orderBy: { id: 'desc' }
    })
    return {status:0,msg:"成功",data:show,total:total,page:page,pagesize:pagesize,totalpages:Math.ceil(total/pagesize)}
}

async function reagent_update(request: FastifyRequest, reply: any) {
    const { id, name, specifications, warn_number, price, storage_condition, teamid, warn_days, using }:ReagentUpdateRequestBody = request.body as ReagentUpdateRequestBody
    const update = await prisma.reagent.update({
        where: { id },
        data: { name, specifications, warn_number, price, storage_condition, teamid, warn_days, using }
    })

    return {status:0,msg:"成功",data:update}
}


async function reagent_del(request: FastifyRequest, reply: any) {
    const { id }:ReagentDelRequestBody = request.body as ReagentDelRequestBody
    const del = await prisma.reagent.update({
        where: { id },
        data: { using: false }
    })
    return {status:0,msg:"成功",data:del}
}



async function reagent_showall(request: FastifyRequest, reply: any) {
    const { teamid }:ReagentShowAllRequestQuery = request.query as ReagentShowAllRequestQuery
    const showall = await prisma.reagent.findMany({
        where: { teamid: teamid,using:true },
        select:{
            id:true,
            name:true,
        },
        orderBy: { id: 'desc' }
    })
    return {status:0,msg:"成功",data:showall}
}


export {reagent_add,reagent_show,reagent_update,reagent_del,reagent_showall}