/*
 * @Author: Cookie
 * @Date: 2021-07-18 18:04:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-15 19:43:06
 * @Description:
 */

import Home from '@/view/dashboard/Index';
import { Navigate } from 'react-router';

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
    element: <Home />,
  },
  {
    path: '/',
    element: <Navigate to="/about" />,
  },
];

export default routes;
