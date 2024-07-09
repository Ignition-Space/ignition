/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-05-14 10:18:02
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2024-06-19 13:33:16
 * @FilePath: /fast-gateway-web/clients/userCenter/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {},
  },
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: `${pathResolve('src')}/`,
      },
    ],
  },
  build: {
    outDir: '../../dist-web/user',
  },
  server: {
    host: '0.0.0.0',
    port: 10010,
    proxy: {
      // '/api': {
      //   // 所要代理的目标地址
      //   // target: 'http://127.0.0.1:3000',
      //   // target: 'http://127.0.0.1:4000',
      //   target: 'http://127.0.0.1:3031',
      //   changeOrigin: true,
      // },
      '/api': {
        target: 'http://127.0.0.1:3031', // 假设后端服务运行在 3032 端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉代理路径中的 '/backend'
      },
    },
  },
});
