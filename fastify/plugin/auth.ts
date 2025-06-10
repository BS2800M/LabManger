import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import { FastifyInstance,FastifyRequest,FastifyReply } from 'fastify'



async function auth(fastify:FastifyInstance,options:any){
    fastify.decorate('auth',async function(request:FastifyRequest,reply:FastifyReply){
        const jwt_token = request.headers.token as string
        if(!jwt_token){
            return reply.status(401).send({status:1,msg:'认证错误'})
        }
        try{
            const decoded = jwt.verify(jwt_token,'labmanger')
        }
        catch(err){
            return reply.status(401).send({status:1,msg:'认证错误'})
        }
        
    })
}

export default fp(auth)