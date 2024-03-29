import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Router from './router';

import 'normalize.css';
import 'antd/dist/antd.css';
import '@/assets/styles/default.less';
import '@/assets/styles/global.less';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <Router />
    </HashRouter>
  </Provider>,
);
