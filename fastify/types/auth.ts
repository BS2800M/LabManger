// 扩展 FastifyRequest 接口
declare module 'fastify' {
    interface FastifyRequest {
        teamid: number
        userid: number
        username: string    
        role: string
        scope: string
        validate_where: object
    }
}

// 定义 JWT payload 类型
export interface JWTPayload {
    userid: number
    username: string
    role: string
    teamid: number
}


