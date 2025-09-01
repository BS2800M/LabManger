// 导入polyfill以支持ES2024特性
import './polyfills.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './global.css'

const app = createApp(App)
app.use(router)
app.mount('#app')



