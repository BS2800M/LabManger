import { FastifyRequest } from 'fastify'
import prisma from '../prisma/script.js'
import { LoginRequestBody, LogoutRequestBody } from '../types/loginout.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken';








async function login(request: FastifyRequest, reply: any) {
    const {username,password}:LoginRequestBody = request.query as LoginRequestBody
    const user = await prisma.user.findFirst({
        where:{
            username:username,
            password:crypto.createHash('sha256').update(password).digest('hex'),
            using:true
        }
    })
    if(!user){
        return reply.status(400).send({status:1,msg:"用户或密码错误"})
    } 
    const token = jwt.sign({
        userid:user.id,
        username:user.username,
        permission:user.permission,
        teamid:user.teamid
    },'labmanger',{expiresIn:'5000h'})
    return {
        status:0,
        msg:"登录成功",
        token:token,
    }
}
async function logout(request: FastifyRequest, reply: any) {
    const {username}:LogoutRequestBody = request.query as LogoutRequestBody
    const user = await prisma.user.findFirst({
        where:{
            username:username,
            using:true
        }
    })
    return {
        status:0,
        msg:"登出成功"
    }
}
export {login,logout}



