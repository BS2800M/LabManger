import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import { FastifyInstance,FastifyRequest,FastifyReply } from 'fastify'
import { JWTPayload} from '../types/auth.js'

async function auth(fastify:FastifyInstance,options:any){
    fastify.decorate('auth',async function(request:FastifyRequest,reply:FastifyReply){
        const jwt_token = request.headers.token as string

        if(!jwt_token){
            return reply.status(401).send({status:1,msg:'请先登录'})
        }
        try{
            const decoded = jwt.verify(jwt_token,'labmanger') as JWTPayload   
            request.userid = decoded.userid
            request.username = decoded.username as string
            request.role = decoded.role as string
            request.teamid = decoded.teamid
        
        }
        catch(err){
            return reply.status(401).send({status:1,msg:'认证错误'})
        }
        
    })
}

export default fp(auth)