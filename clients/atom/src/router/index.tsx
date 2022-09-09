/*
 * @Author: Cookie
 * @Date: 2021-07-18 18:04:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-09 10:04:34
 * @Description:
 */

import Home from '@/view/Home';
import { Navigate } from 'react-router';
import BaseLayout from '@/layout/BaseLayout';

export interface RouterProps {
  path: string;
  component?: any;
  title?: string;
  exact?: boolean;
  name?: string;
  routes?: RouterProps[];
}

const routes = [
  {
    path: '/',
    element: <BaseLayout />,
  },
  {
    path: '/test',
    element: <Home />,
  },
  {
    path: '/',
    element: <Navigate to="/about" />,
  },
];

export default routes;
