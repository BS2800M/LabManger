import Fastify from 'fastify';
import mainrouter from './router/mainrouter.js';
import auth from './plugin/auth.js';
import { startScheduledTasks } from './plugin/scheduler.js';
import check_permission from './plugin/permission.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import cluster from 'cluster';
// 环境检测
const isProduction = process.env.NODE_ENV === 'production' ? true : false;
async function setErrorHandler(mainfastify) {
    mainfastify.setErrorHandler(function (error, request, reply) {
        if (error.validation) {
            reply.status(400).send({ status: 1, msg: "请求数据格式错误", data: error.validation });
        }
        else {
            console.log(error);
            reply.status(500).send({ status: 1, msg: "服务器错误", data: error });
        }
    });
}
async function start() {
    const mainfastify = Fastify({ logger: isProduction === true ? false : true, });
    try {
        await setErrorHandler(mainfastify); //设置错误处理
        await startScheduledTasks(); //启动定时任务
        await mainfastify.register(check_permission); //注册插件
        await mainfastify.register(auth); //注册插件
        await mainrouter(mainfastify, null); //注册路由
        await mainfastify.listen({ port: 8000 }); //启动
    }
    catch (err) {
        mainfastify.log.error(err);
        process.exit(1);
    }
}
if (isProduction === true) {
    if (cluster.isPrimary) {
        console.log(`生产环境：启动多进程模式 主进程 ${process.pid}`);
        for (let i = 0; i < 3; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`进程 ${worker.process.pid} 已退出`);
        });
    }
    else {
        console.log(`生产环境：启动单进程模式 子进程 ${process.pid}`);
        start();
    }
}
else {
    console.log(`开发环境：单进程模式 ${process.pid}`);
    start();
}
