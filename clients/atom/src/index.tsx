/*
 * @Author: Cookie
 * @Date: 2021-07-18 15:49:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-08 09:22:13
 * @Description:
 */

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './global.less';

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App></App>
  </BrowserRouter>,
);
