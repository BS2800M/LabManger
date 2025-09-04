// electron.vite.config.jsentry
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default {
    main: {
      // vite config options
    },
    preload: {
      // vite config options
    },
    renderer: {
      // vite config options
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src/renderer/src'),
        },
      },
      plugins: [vue(),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],

      server: {
        hmr:true,
        host: '0.0.0.0',
        port: 5173,
        proxy:{
          '/cross': {
            target: 'https://127.0.0.1:8001',
            changeOrigin: true,
            secure: false, // 忽略自签名证书验证
            rewrite:(path)=>path.replace(/^\/cross/,''), //api替换为''
            configure: (proxy, options) => {
              // 忽略 SSL 证书错误
              proxy.on('error', (err, req, res) => {
              });
            },
          },
        },
      },
    },
  }