import { FastifyRequest } from 'fastify'
import prisma from '../prisma/script.js'
import { inventory_update } from './inventory.js'
import { 
    InboundRequestBody,
    OutboundRequestBody,
    SpecialOutboundRequestBody,
    OperationShowRequestQuery,
    OperationShowSearchParams,
    OperationDelRequestBody,
    TransformedShow } from '../types/operation.js'

async function inbound(request: FastifyRequest, reply: any) {
    const {inboundlist}:InboundRequestBody=request.body as InboundRequestBody
    let addlist:any[]=[]
    let addid:any=await prisma.operation.aggregate({ //获取当前操作记录的最大id
        _max:{
            id:true
        }
    })
    if(addid._max.id==null){ //如果当前操作记录的最大id为null，则设置为0
        addid._max.id=0
    }
    let startid:number=addid._max.id+1 //设置开始id
    let nowid:number=startid //设置当前id

    for (const item of inboundlist){ //遍历入库列表
        for(let i=0;i<item.number;i++){  //遍历入库数量
            addlist.push({
                id:nowid,
                reagentid:item.reagentid,
                lotid:item.lotid,
                operation_action:"inbound",
                using:true,
                barcodenumber:(nowid+1000000).toString(),
                userid:item.userid,
            })
            nowid=nowid+1 //更新当前id
        }
        await inventory_update(item.reagentid,item.lotid,item.number) //更新每种试剂库存
    }
    await prisma.operation.createMany({ //批量创建操作记录
        data:addlist
    })

    const include={
        reagent:{
            select:{
                name:true,
            }
        },
        lot:{
            select:{
                name:true,
            }
        }
    }
    const resultlist=await prisma.operation.findMany({ //查询刚刚创建的记录
        where:{
            id:{
                gte:startid,
                lte:nowid
            }
        },
        include:include,
        orderBy:{
            id:"asc"
        }
    })
    const transformed_show:TransformedShow[]=resultlist.map((item)=>{ //将查询结果转换为Transformed_Show类型
        return{
            id:item.id,
            reagentid:item.reagentid,
            lotid:item.lotid,
            reagentname:item.reagent.name,
            lotname:item.lot.name,
            barcodenumber:item.barcodenumber,
            operation_action:item.operation_action,
            using:item.using,
            userid:item.userid,
        }
    })
    return{status:0,msg:"入库成功",data:transformed_show}
}

async function outbound(request: FastifyRequest, reply: any) {
    const {barcodenumber,userid}:OutboundRequestBody=request.body as OutboundRequestBody
    let returnmsg:string=""
    let result:number=await prisma.operation.count({ //查询条码是否存在
        where:{barcodenumber:barcodenumber},
    })
    if(result==0){
        return reply.status(400).send({status:1,msg:"条码不存在"})
    }
    if(result>1){
        return reply.status(400).send({status:1,msg:"已经出库"})
    }
    if(result==1){
        const search:any=await prisma.operation.findFirst({ //查询条码对应的操作记录
            where:{barcodenumber:barcodenumber}
        })
        const inventory_update_result=await inventory_update(search.reagentid,search.lotid,-1) //更新库存
        if(inventory_update_result.includes("库存不足")){
            return reply.status(400).send({status:1,msg:"库存不足"})
        }
        if(inventory_update_result.includes("库存达到警告值")){
            returnmsg=inventory_update_result+"\n"
        }
        if(inventory_update_result.includes("出库成功")){
            returnmsg=inventory_update_result+"\n"
        }
        await prisma.operation.create({ //创建出库记录
            data:{
                reagentid:search.reagentid,
                lotid:search.lotid,
                operation_action:"outbound",
                using:true,
                barcodenumber:barcodenumber,
                userid:userid,
            }
        })
        return{status:0,msg:returnmsg}
    }


}

async function special_outbound(request: FastifyRequest, reply: any) {
    const {outboundlist}:any=request.body as any
    let returnmsg:string=""
    let addlist:any[]=[]

    for (const item of outboundlist){
        const inventory_update_result=await inventory_update(item.reagentid,item.lotid,-item.number) //更新库存
        if(inventory_update_result.includes("库存不足")){
            returnmsg=returnmsg+inventory_update_result+"\n"
            return{status:1,msg:returnmsg}
        }
        if(inventory_update_result.includes("库存达到警告值")){
            returnmsg=returnmsg+inventory_update_result+"\n"
        }
        if(inventory_update_result.includes("出库成功")){
            returnmsg=returnmsg+inventory_update_result+"\n"
        }
        for(let i=0;i<item.number;i++){
            addlist.push({
                reagentid:item.reagentid,
                lotid:item.lotid,
                operation_action:"special_outbound",
                using:true,
                barcodenumber:"unknown",
                userid:item.userid,
            })
        }
        await prisma.operation.createMany({ //批量创建操作记录
            data:addlist
        })
    }

    return{status:0,msg:returnmsg}
}


async function operation_show(request: FastifyRequest, reply: any) {
    const {teamid,reagentname,searchlater,searchearlier,barcodenumber,pagesize,page}:OperationShowRequestQuery=request.query as OperationShowRequestQuery
    const where:OperationShowSearchParams = {
        using:true,
        reagent:{
            teamid:teamid,
        }
    }
    if (searchlater!=""){ //如果搜索时间范围不为空，则设置时间范围
        where.creation_time={gte:searchlater}
    }   
    if (searchearlier!=""){
        where.creation_time={lte:searchearlier}
    }
    if (barcodenumber!=""){ //如果条码不为空，则设置条码
        where.barcodenumber={contains:barcodenumber}
    }
    if (reagentname!=""){ //如果试剂名称不为空，则设置试剂名称
        where.reagent.name={contains:reagentname}
    }
    const include={ //设置包含的属性
        reagent:{
            select:{
                name:true,
            }
        },
        lot:{
            select:{
                name:true,
            }
        },
        user:{
            select:{
                username:true,
            }
        }
    }
    const total = await prisma.operation.count({ where }) //获取总数
    const show=await prisma.operation.findMany({ //查询操作记录
        where:where,
        include:include,
        skip:(page-1)*pagesize,
        take:pagesize,
        orderBy:{
            id:"desc"
        }
    })
    const transformed_show:TransformedShow[]=show.map((item)=>{ //将查询结果转换为Transformed_Show类型
        return{
            id:item.id,
            reagentid:item.reagentid,
            lotid:item.lotid,
            reagentname:item.reagent.name,
            lotname:item.lot.name,
            barcodenumber:item.barcodenumber,
            operation_action:item.operation_action,
            using:item.using,
            userid:item.userid,
            username:item.user.username,
            creation_time:item.creation_time,
        }
    })
    return{status:0,msg:"成功",data:transformed_show,total:total,page:page,pagesize:pagesize,totalpages:Math.ceil(total/pagesize)}
}


async function operation_del(request: FastifyRequest, reply: any) {
    const {id}:OperationDelRequestBody=request.body as OperationDelRequestBody
    const del=await prisma.operation.update({
        where:{id:id},
        data:{
            using:false
        }
    })
    await inventory_update(del.reagentid,del.lotid,-1) //更新库存

    return{status:0,msg:"成功",data:del}
}

export {inbound,outbound,special_outbound,operation_show,operation_del}










