import axios from 'axios';
import router from '@/router/index.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

// var mybaseurl="http://127.0.0.1:3000/cross"  //调试
var mybaseurl=null  
var myservice=null


async function request_init(){
  if (mybaseurl==null)
  {
     mybaseurl= await myapi.read_conf()
     mybaseurl=mybaseurl.baseurl
  }
  myservice=axios.create({
    baseURL:mybaseurl ,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
// 添加请求拦截器
myservice.interceptors.request.use(function (config) {
  if(config.url !== "/signin/"){   // 判断请求是否是登录接口
    let sendtoken=localStorage.getItem('token')
    config.headers.token = sendtoken // 如果不是登录接口，就给请求头里面设置token
  }
  return config;
}, function (err) {
  console.log(err)
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {type:'error',message:"无法连接服务器或服务器内部错误",action:null})
  return Promise.reject(err);
});

//添加响应拦截器
myservice.interceptors.response.use(
    res=>{
          return res.data
    },
    err=>{
          console.log(err)
          if (err.response!==undefined){
            eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {type:'error',message:err.response.data.msg,action:null})
          }
          else{
            eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {type:'error',message:"无法连接服务器或服务器内部错误",action:null})
          }
          if(err.response.data.msg=='认证错误'){
            router.push('/login')
          }
          return Promise.reject(err);  
    })

}

export  const myrequest = {
  async get(url, params) {
  await request_init()
  return myservice.get(url,{params:params});
  },
  async post(url, data) {
  await request_init()
  return myservice.post(url,data);
  },
  async put(url, data) {
  await request_init()
  return myservice.put(url, data);
  },
}









