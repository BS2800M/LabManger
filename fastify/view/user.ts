import { FastifyRequest } from 'fastify'
import prisma from '../prisma/script.js'
import {
    UserAddRequestBody,
    UserDelRequestBody
} from '../types/user.js'
import crypto from 'crypto'



async function user_add(request: FastifyRequest, reply: any) {
    const {username,password,permission}:UserAddRequestBody = request.body as UserAddRequestBody
    const password_sha256 = crypto.createHash('sha256').update(password).digest('hex')
    const user = await prisma.user.create({
        data:{
            username,
            password:password_sha256,
            permission,
            using:true
        }
    })
    return {
        status: 0,
        msg: "成功添加用户",
    }
}
async function user_del(request: FastifyRequest, reply: any) {
    const {id}:UserDelRequestBody = request.body as UserDelRequestBody
    const user = await prisma.user.update({
        where:{
            id
        },
        data:{
            using:false
        }
    })
    return {
        status: 0,
        msg: "成功删除用户",
    }
}
export {user_add,user_del}

