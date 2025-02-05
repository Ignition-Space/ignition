import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';

import 'normalize.css';
import 'antd/dist/antd.css';
import '@/assets/styles/default.less';
import '@/assets/styles/global.less';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router />,
);
