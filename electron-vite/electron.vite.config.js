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
      ],

      server: {
        hmr:true,
        host: '0.0.0.0',
        port: 5173,
        proxy:{
          '/cross': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            rewrite:(path)=>path.replace(/^\/cross/,'') //api替换为'',
          },
        },
      },
    }
  }