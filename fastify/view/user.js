import prisma from '../prisma/script.js';
import crypto from 'crypto';
async function user_add(request, reply) {
    const { username, password, permission, teamid } = request.body;
    const password_sha256 = crypto.createHash('sha256').update(password).digest('hex');
    const user = await prisma.user.create({
        data: {
            username,
            password: password_sha256,
            permission,
            using: true,
            teamid: teamid
        }
    });
    return {
        status: 0,
        msg: "成功添加用户",
    };
}
async function user_del(request, reply) {
    const { id } = request.body;
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            using: false
        }
    });
    return {
        status: 0,
        msg: "成功删除用户",
    };
}
export { user_add, user_del };
