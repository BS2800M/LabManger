import prisma from '../prisma/script.js'
import { FastifyRequest } from 'fastify'
import { 
    LotAddRequestBody,
    LotShowRequestQuery,
    LotSearchParams,
    LotUpdateRequestBody,
    LotDelRequestBody,
    LotShowAllRequestQuery,
    TransformedShow } from '../types/lot.js'





async function lot_add(request: FastifyRequest, reply: any) {
    const { name, reagentid, expiration_date, using }:LotAddRequestBody = request.body as LotAddRequestBody
    const { teamid,userid } = request
    const add = await prisma.lot.create({
        data: { name, reagentid, expiration_date, using }
    })

    let warn_days:any=await prisma.reagent.findUnique({ //获取试剂的预警天数
        where:{id:reagentid},
        select:{
            warn_days:true
        }
    }) as {warn_days:number}
    warn_days=warn_days.warn_days //将warn_days转换为数字
    await prisma.inventory.create({ //创建库存
        data: {
            reagentid:reagentid,
            lotid:add.id,
            inventory_number:0,
            last_outbound_time:new Date(),
            lastweek_outbound_number:0,
            using:true
        }
    })

    return {status:0,msg:"成功",data:add}
}

async function lot_show(request: FastifyRequest, reply: any) {
    const { reagentname, page, pagesize }:LotShowRequestQuery = request.query as LotShowRequestQuery
    const where:LotSearchParams = {
        using:true,
        reagent:{
            ...request.validate_where
        }
    }
    if(reagentname!==""){
        where.reagent.name={contains:reagentname}
    }

    
    const total = await prisma.lot.count({ where }) //获取总数
    const show:any[]= await prisma.lot.findMany({ //获取分页数据
        where: where,
        skip: (page - 1) * pagesize,
        take: pagesize,
        include:{
            reagent:{
                select:{
                    name:true
                }
            }
        },
        orderBy: { id: 'desc' }
    })
    const transformed_show:TransformedShow[]=show.map((item:TransformedShow)=>{ //将show中的reagent.name 转换为 reagentname
        return {
            id:item.id,
            name:item.name,
            expiration_date:item.expiration_date,
            creation_time:item.creation_time,
            reagentid:item.reagentid,
            reagentname:item.reagent.name,
            using:item.using
        }
    })
    return {status:0,msg:"成功",data:transformed_show,total:total,page:page,pagesize:pagesize,totalpages:Math.ceil(total/pagesize)}
}


async function lot_update(request: FastifyRequest, reply: any) {
    const { id, name, reagentid, expiration_date, using }:LotUpdateRequestBody = request.body as LotUpdateRequestBody
    const { teamid,userid } = request
    const update = await prisma.lot.update({
        where: { id },
        data: { name, reagentid, expiration_date, using }
    })
    return {status:0,msg:"成功",data:update}
}

async function lot_del(request: FastifyRequest, reply: any) {
    const { id }:LotDelRequestBody = request.body as LotDelRequestBody
    const { teamid,userid } = request
    const del = await prisma.lot.update({
        where: { id },
        data: { using: false }
    })
    await prisma.inventory.updateMany({  //删除对应的库存表
        where:{lotid:id},
        data:{using:false}
    })
    return {status:0,msg:"成功",data:del}
}


async function lot_showall(request: FastifyRequest, reply: any) {
    const { reagentid }:LotShowAllRequestQuery = request.query as LotShowAllRequestQuery
    const showall = await prisma.lot.findMany({
        where: { reagentid: reagentid,using:true },
        select:{
            id:true,
            name:true,
        },
        orderBy: { id: 'desc' }
    })
    return {status:0,msg:"成功",data:showall}
}

export {lot_add,lot_show,lot_update,lot_del,lot_showall}