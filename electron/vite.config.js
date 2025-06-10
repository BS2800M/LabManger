import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({importStyle: "sass",directives: true,})]
    }),

  ],
  server: {
    host: '0.0.0.0',
    port:3000,
    proxy:{
      '/cross': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite:(path)=>path.replace(/^\/cross/,'') //api替换为'',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})




  
  



  










