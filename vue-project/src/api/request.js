import axios from 'axios';
import router from '@/router/index.js'


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
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

//添加响应拦截器
myservice.interceptors.response.use(
    res=>{
          if(res.data.status==1){
                console.log(res.data)
                if(res.data.msg=='非法请求'){
                  router.push('/login')
                }
                return Promise.reject(res.data.msg);  
          }
          return res

    },
    err=>{
          console.log(err)
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









