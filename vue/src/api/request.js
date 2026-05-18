import axios from 'axios'
import router from '@/router/index.js'
import { openErrorMessageBox } from '@/utils/messagebox'
import config from '../../public/config.json'

const myservice = axios.create({
  baseURL: config.baseurl,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

myservice.interceptors.request.use(
  (config) => {
    const publicUrls = [
      '/identity/auth/signin-reviewer',
      '/identity/auth/signin-checker',
      '/identity/auth/signout',
    ]
    if (!publicUrls.includes(config.url || '')) {
      const reviewerSessionId = localStorage.getItem('reviewerSessionId')
      if (reviewerSessionId) {
        config.headers.sessionid = reviewerSessionId
      }
    }
    return config
  },
  (err) => Promise.reject(err)
)

myservice.interceptors.response.use(
  (res) => res.data,
  (err) => {
       openErrorMessageBox({
        title: '网络连接错误',
        message:  "无法连接服务器或服务器内部错误",
        action: null,
      })
      if (err.response.data.error === 'Unauthorized') {
        router.push('/signin')
      }
    return Promise.reject(err)
  }
)

export const myrequest = {
  get(url, params) {
    return myservice.get(url, { params })
  },
  post(url, data) {
    return myservice.post(url, data)
  },
  put(url, data) {
    return myservice.put(url, data)
  }
}
