import { FastifyRequest } from "fastify"
import prisma from '../prisma/script.js';
import { 
    InventoryQuery,
    InventoryWhere,
    TransformedInventoryShow,
    InventoryAudit
} from '../types/inventory.js'

async function inventory_show(request: FastifyRequest, reply: any) {
    const {teamid,page,pagesize,only_warn}:InventoryQuery=request.query as InventoryQuery
    if(only_warn){ //只显示需要提醒的库存
        // 先获取所有库存数据，过滤出预警库存，然后分页
        const allInventory = await prisma.inventory.findMany({
            where: {
                reagent: {
                    teamid: teamid
                },
                using: true
            },
            include: {
                reagent: {
                    select: {
                        name: true,
                        warn_number: true,
                        specifications: true,
                        warn_days: true
                    }
                },
                lot: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                id: 'asc'
            }
        })
        // 先过滤预警库存
        const filteredInventory = allInventory.filter(item => {
            let isLowStock = item.inventory_number <= item.reagent.warn_number //库存不足条件
            let lastoutbound_isotime = new Date(item.last_outbound_time).getTime()
            let warn_isotime = lastoutbound_isotime + item.reagent.warn_days * 24 * 60 * 60 * 1000
            let now_isotime = new Date().getTime()
            let isOverWarnTime = (warn_isotime <= now_isotime) //超过预警时间条件
            return isLowStock && isOverWarnTime
        })
        // 然后进行分页
        const total = filteredInventory.length
        const startIndex = (page - 1) * pagesize
        const endIndex = startIndex + pagesize
        const show = filteredInventory.slice(startIndex, endIndex)
        // 转换数据格式
        const transformed_show: TransformedInventoryShow[] = show.map((item: any) => {
            return {
                id: item.id,
                reagentid: item.reagentid,
                lotid: item.lotid,
                reagentname: item.reagent.name,
                lotname: item.lot.name,
                inventory_number: item.inventory_number,
                last_outbound_time: item.last_outbound_time,
                lastweek_outbound_number: item.lastweek_outbound_number,
                warn_number: item.reagent.warn_number,
                specifications: item.reagent.specifications,
                warn_days: item.reagent.warn_days,
            }
        })
          return reply.status(200).send({status: 0,msg: "成功", data: transformed_show, total: total,page: page,pagesize: pagesize,totalpages: Math.ceil(total / pagesize) })
    }
    
    // 非预警情况的处理
    let where:InventoryWhere={
        reagent:{
            teamid:teamid
        },
        using:true,
    }
    const total = await prisma.inventory.count({ where }) //获取总数
    const show = await prisma.inventory.findMany({
        where: where ,
        skip: (page - 1) * pagesize,
        take: pagesize,
        orderBy: {
            id: 'asc'
        },
        include: {
            reagent: {
                select: {
                    name: true,
                    warn_number: true,
                    specifications: true,
                    warn_days: true
                }
            },
            lot: {
                select: {
                    name: true
                }
            }
        }
    })
    const transformed_show: TransformedInventoryShow[] = show.map((item: TransformedInventoryShow) => {
        return {
            id: item.id,
            reagentid: item.reagentid,
            lotid: item.lotid,
            reagentname: item.reagent.name,
            lotname: item.lot.name,
            inventory_number: item.inventory_number,
            last_outbound_time: item.last_outbound_time,
            lastweek_outbound_number: item.lastweek_outbound_number,
            warn_number: item.reagent.warn_number,
            specifications: item.reagent.specifications,
            warn_days: item.reagent.warn_days,
        }
    })
    return reply.status(200).send({ status: 0, msg: "成功", data: transformed_show, total: total, page: page, pagesize: pagesize, totalpages: Math.ceil(total / pagesize) })
}

async function inventory_update(reagentid:number,lotid:number,update_number:number) {
    let result:string=""
    const inventory_old:any = await prisma.inventory.findFirst({ //查询对应库存的条目
        where:{
            reagent:{
                id:reagentid
            },
            lot:{
                id:lotid
            }
        },
        include:{
            reagent:{
                select:{
                    warn_number:true,
                    name:true,
                }
            }
        }
    })

    if(inventory_old.inventory_number+update_number<0){
        return inventory_old.reagent.name+":库存不足" //库存不足时函数中断 不再进行下面的操作
    }
    if(inventory_old.inventory_number+update_number<=inventory_old.reagent.warn_number){
        result=inventory_old.reagent.name+":库存达到警告值" //库存达到警告时函数不会中断 还会继续进行下面的操作
    }
    const inventory_new = await prisma.inventory.update({ //更新库存信息
        where:{
            id:inventory_old.id
        },
        data:{
            inventory_number:inventory_old.inventory_number+update_number,
            last_outbound_time:new Date(),
        }
    })
    return inventory_old.reagent.name+":出库成功"
}



async function inventory_audit(request: FastifyRequest, reply: any) { 
    const {reagentid,lotid}:InventoryAudit=request.query as InventoryAudit
    const where:any={using:true}
    if(reagentid!=-1 || lotid!=-1){
        where.reagent={
            id:reagentid
        }
        where.lot={
            id:lotid
        }
    }
    const inventory_needaudit = await prisma.inventory.findMany({ //查询库存
        where:where
    })
    for(const item of inventory_needaudit){ 
        const outbound_number:number=await prisma.operation.count({ //查询出库数量
            where:{
                reagentid:item.reagentid,
                lotid:item.lotid,
                operation_action:{
                    in:['outbound','special_outbound']
                }
            }
        })
        const inbound_number:number=await prisma.operation.count({ //查询入库数量
            where:{
                reagentid:item.reagentid,
                lotid:item.lotid,
                operation_action:'inbound'
            }
        })
        let now=new Date()
        let today=now.getDay()
        let today_to_lastmonday=today === 0 ? 6: today-1 //今天到这周一的天数
        let lastmonday = new Date(now)
        lastmonday.setDate(now.getDate()-today_to_lastmonday-7) //计算上周一
        lastmonday.setHours(0,0,0,1)
        let lastsunday=new Date(now)
        lastsunday.setDate(now.getDate()-today_to_lastmonday-1) //计算上周日
        lastsunday.setHours(23,59,59,999)
        const lastweek_outbound_number=await prisma.operation.count({ //查询上周出库数量
            where:{
                reagentid:item.reagentid,
                lotid:item.lotid,
                operation_action:{
                    in:['outbound','special_outbound']
                },
                creation_time:{
                    gte:lastmonday,
                    lte:lastsunday
                }
            }
        })
        const inventory_update=await prisma.inventory.update({ //更新库存信息
            where:{id:item.id},
            data:{
                inventory_number:inbound_number-outbound_number,
                lastweek_outbound_number:lastweek_outbound_number
            }
        })
        return {status:0,msg:"成功"}
    }
}



export {inventory_show,inventory_update,inventory_audit}