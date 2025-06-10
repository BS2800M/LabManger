import Fastify from 'fastify';
import mainrouter from './router/mainrouter.js';
const mainfastify = Fastify({
    logger: true,
});
mainfastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
        reply.status(400).send({ status: 1, msg: "请求数据格式错误", data: error.validation });
    }
    else {
        console.log(error);
        reply.status(500).send({ status: 1, msg: "服务器错误", data: error });
    }
});
export default mainfastify;
mainrouter(mainfastify, null);
// Run the server!
try {
    await mainfastify.listen({ port: 8000 });
}
catch (err) {
    mainfastify.log.error(err);
    process.exit(1);
}
