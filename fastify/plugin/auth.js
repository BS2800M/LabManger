import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
async function auth(fastify, options) {
    fastify.decorate('auth', async function (request, reply) {
        const jwt_token = request.headers.token;
        if (!jwt_token) {
            return reply.status(401).send({ status: 1, msg: '认证错误' });
        }
        try {
            const decoded = jwt.verify(jwt_token, 'labmanger');
            request.userid = decoded.userid;
            request.username = decoded.username;
            request.permission = decoded.permission;
            request.teamid = decoded.teamid;
        }
        catch (err) {
            return reply.status(401).send({ status: 1, msg: '认证错误' });
        }
    });
}
export default fp(auth);
