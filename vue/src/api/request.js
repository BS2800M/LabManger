import axios from 'axios'
import router from '@/router/index.js'
import { openErrorMessageBox } from '@/utils/messagebox'

const myservice = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/cross',
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
    if (err.response !== undefined) {
      openErrorMessageBox({
        title: '网络连接错误',
        message: err.response.data.message || "无法连接服务器或服务器内部错误",
        action: null,
      })
      if (err.response.data) {
        if (err.response.data.error === 'Unauthorized') {
        router.push('/signin')
      }
    }
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
