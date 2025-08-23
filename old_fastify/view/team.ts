import prisma from '../prisma/script.js'
import { FastifyRequest } from 'fastify'
import { 
    TeamShowRequestQuery, 
    TeamSearchParams,
    TeamUpdateRequestBody,
    TeamDelRequestBody,
    TeamAddRequestBody 
} from '../types/team.js';

async function team_add(request: FastifyRequest, reply: any) {
    const {name,phone,note}:TeamAddRequestBody = request.body as TeamAddRequestBody
    const add:object=await prisma.team.create({
        data:{
            name:name,
            phone:phone,
            note:note,
            using:true
        }
    })
    return {status:0,msg:"成功",data:add}
}

async function team_show(request: FastifyRequest,reply: any) {
    let { name, page, pagesize}:TeamShowRequestQuery = request.query as TeamShowRequestQuery
    // 构建查询条件
    const where:TeamSearchParams = {using: true}
    if (name!==""){
        where.name = { contains: name }
    }
    // 获取总数
    const total = await prisma.team.count({ where })
    // 获取分页数据
    const show:object[] = await prisma.team.findMany({
        where,
        skip:(page - 1) * pagesize,
        take: pagesize,
        orderBy: { id: 'desc' }
    })
    return {
        status: 0,
        msg: "成功",
        data: show,
        total: total,  // 使用 count 查询的结果
        page: page,
        pagesize: pagesize,
        totalpages: Math.ceil(total / pagesize)  // 使用总数计算总页数
    }
}   



async function team_update(request: FastifyRequest, reply: any) {
    const {id,name,phone,note,using}:TeamUpdateRequestBody = request.body as TeamUpdateRequestBody
    const update= await prisma.team.update({
        where:{id},
        data:{
            name:name,
            phone:phone,
            note:note,
            using:using
        }
    })
    return {status:0,msg:"成功",data:update}
}   



async function team_del(request: FastifyRequest, reply: any) {
    const {id}:TeamDelRequestBody = request.body as TeamDelRequestBody
    const del= await prisma.team.update({
        where:{
            id:id
        },
        data:{
            using:false
        }
    })
    return {status:0,msg:"成功",data:del}
}   




export {team_add,team_show,team_update,team_del}   
