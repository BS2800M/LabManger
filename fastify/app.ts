import Fastify from 'fastify'
import mainrouter from './router/mainrouter.js'
import auth from './plugin/auth.js'
import { FastifyInstance } from 'fastify'



async function setErrorHandler(mainfastify:FastifyInstance){ //设置错误处理
mainfastify.setErrorHandler(function (error:any, request:any, reply:any) {
  if (error.validation) {
    reply.status(400).send({ status: 1, msg: "请求数据格式错误",data:error.validation })
  } else {
    console.log(error)
    reply.status(500).send({ status: 1, msg: "服务器错误",data:error })
  }
})
}

async function start(){ //启动
  const mainfastify = Fastify({logger: true,})
try {
  await setErrorHandler(mainfastify) //设置错误处理
  await mainfastify.register(auth) //注册插件
  await mainrouter(mainfastify,null) //注册路由
  await mainfastify.listen({ port:8000 }) //启动
} 
catch (err) {
  mainfastify.log.error(err)
  process.exit(1)
}
}



start()