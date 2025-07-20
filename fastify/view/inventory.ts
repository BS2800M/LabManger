import { FastifyRequest } from "fastify"
import prisma from '../prisma/script.js';
import { 
    InventoryQuery,
    InventoryWhere,
    TransformedInventoryShow,
    InventoryUpdateList
} from '../types/inventory.js'

async function inventory_show(request: FastifyRequest, reply: any) {
    const {page,pagesize,only_warn}:InventoryQuery=request.query as InventoryQuery
    let where:InventoryWhere={
        reagent:{
            ...request.validate_where,
            using:true
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


async function inventory_update_list(list:InventoryUpdateList[]){
    let returnmsg:string="" //返回信息
    const where_list:any[]=await Promise.all(list.map(async (item:InventoryUpdateList)=>{ //构建查询条件
        return {
            reagentid:item.reagentid,
            lotid:item.lotid,
            using:true
        }
    }))

    let inventory_list:any[]=await prisma.inventory.findMany({ //查询库存
        where:{
            OR:where_list
        },
        include:{
            reagent:{
                select:{
                    name:true,
                    warn_number:true,
                }
            }
        }
    })
    list=list.filter((item:InventoryUpdateList,index:number)=>{
        item.inventory_id=inventory_list[index].id 
        item.inventory_number=inventory_list[index].inventory_number as number
        item.warn_number=inventory_list[index].reagent.warn_number
        item.reagentname=inventory_list[index].reagent.name
        if(item.inventory_number+item.number<0){
            returnmsg+=inventory_list[index].reagent.name+":库存不足\n"
            return false
        }
        return true
    })


    await prisma.$transaction(async (tx) => {  //提交事务
    const update_all=list.map(async (item:any,index:number)=>{ //并行更新库存
        await tx.inventory.update({ //更新库存
            where:{id:item.inventory_id},
            data:{
                inventory_number: {
                    increment: item.number
                },
                last_outbound_time:new Date(),
            }          
        })
        if(item.inventory_number+item.number<=item.warn_number){ //库存达到警告值时 返回信息提示
            returnmsg+=item.reagentname+":库存达到警告值\n"
        }
        else{
            returnmsg+=item.reagentname+":库存更新成功\n"
        }
    })
    await Promise.all(update_all)
    })
return {returnmsg,list}

}








async function inventory_audit_list() { 
    const inventory_needaudit=await prisma.inventory.findMany({ //查询需要审核的库存
        where:{
            using:true
        },
        select:{
            reagentid:true,
            lotid:true,
            id:true
        }
    })
    let now=new Date()
    let today=now.getDay()
    let today_to_lastmonday=today === 0 ? 6: today-1 //今天到这周一的天数
    let lastmonday = new Date(now)
    lastmonday.setDate(now.getDate()-today_to_lastmonday-6) //计算上周一
    lastmonday.setHours(0,0,0,1)
    let lastsunday=new Date(now)
    lastsunday.setDate(now.getDate()-today_to_lastmonday-1) //计算上周日
    lastsunday.setHours(23,59,59,999)




await prisma.$transaction(async (tx) => { //提交事务
const update_all=inventory_needaudit.map(async (item:any)=>{ //并行更新
const outbound_number=await prisma.operation.count({ //查询出库数量
    where:{
        reagentid:item.reagentid,
        lotid:item.lotid,
        operation_action:{in:['outbound','special_outbound']},
        using:true
    }
})
const inbound_number=await prisma.operation.count({ //查询入库数量
    where:{
        reagentid:item.reagentid,
        lotid:item.lotid,
        operation_action:'inbound',
        using:true
    }
})
const lastweek_outbound_number=await prisma.operation.count({ //查询上周出库数量
    where:{
        reagentid:item.reagentid,
        lotid:item.lotid,
        operation_action:{in:['outbound','special_outbound']},
        creation_time:{gte:lastmonday,lte:lastsunday}
    }
})
    await tx.inventory.update({ //更新信息
    where:{id:item.id},
    data:{
        inventory_number:inbound_number-outbound_number,
        lastweek_outbound_number:lastweek_outbound_number
    }
})
})
await Promise.all(update_all)
})

}


async function inventory_audit(request: FastifyRequest, reply: any) { 
    await inventory_audit_list()
    return reply.status(200).send({status:0,msg:"成功"})
}


export {inventory_show,inventory_update_list,inventory_audit,inventory_audit_list}