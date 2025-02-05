/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-05-14 10:18:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-05 14:05:42
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
  },
});
