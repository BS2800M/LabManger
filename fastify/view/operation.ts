import { FastifyRequest } from 'fastify'
import prisma from '../prisma/script.js'
import {inventory_update_list } from './inventory.js'
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
    const userid = request.userid
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
                userid:userid,
            })
            nowid=nowid+1 //更新当前id
        }
    }
    const {returnmsg,list}=await inventory_update_list(inboundlist) //更新库存
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
    return{status:0,msg:returnmsg,data:transformed_show}
}

async function outbound(request: FastifyRequest, reply: any) {
    const {barcodenumber}:OutboundRequestBody=request.body as OutboundRequestBody
    const userid = request.userid
    let returnmsg:string=""
    let result:number=await prisma.operation.count({ //查询条码是否存在
        where:{barcodenumber:barcodenumber},
    })
    if(result==0){
        return reply.status(200).send({status:1,msg:"条码不存在"})
    }
    if(result>1){
        return reply.status(200).send({status:1,msg:"已经出库"})
    }
    if(result==1){
        const search:any=await prisma.operation.findFirst({ //查询条码对应的操作记录
            where:{barcodenumber:barcodenumber}
        })
        const {returnmsg,list}=await inventory_update_list([{reagentid:search.reagentid,lotid:search.lotid,number:-1,userid:userid}]) //更新库存
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
    let {outboundlist}:SpecialOutboundRequestBody=request.body as SpecialOutboundRequestBody
    const userid = request.userid
    for(const item of outboundlist){
        item.number=item.number*(-1) //负数代表出库 减少库存
    }

    const {returnmsg,list}=await inventory_update_list(outboundlist) //更新库存 返回信息提示和过滤后的更新列表
    let addlist:any[]=[]
    for(const item of list){
        for(let i=0;i<-(item.number);i++){ //出库数量为负数 所以需要取反
            addlist.push({
                reagentid:item.reagentid,
                lotid:item.lotid,
                operation_action:"special_outbound",
                using:true,
                barcodenumber:"unknown",
                userid:userid,
            })
        }
    }
    await prisma.operation.createMany({ //批量创建操作记录
        data:addlist
    })
    return{status:0,msg:returnmsg}
}


async function operation_show(request: FastifyRequest, reply: any) {
    const {reagentname,searchlater,searchearlier,barcodenumber,pagesize,page}:OperationShowRequestQuery=request.query as OperationShowRequestQuery
    const teamid = request.teamid
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
    if (del.operation_action=="inbound"){ //如果删除的是入库
   await inventory_update_list([{reagentid:del.reagentid,lotid:del.lotid,number:1}]) //更新库存
    }
    if (del.operation_action=="outbound" || del.operation_action=="special_outbound"){ //如果删除的是出库
    await inventory_update_list([{reagentid:del.reagentid,lotid:del.lotid,number:-1}]) //更新库存
    }
    return{status:0,msg:"成功",data:del}
}

export {inbound,outbound,special_outbound,operation_show,operation_del}










