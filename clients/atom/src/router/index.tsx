/*
 * @Author: Cookie
 * @Date: 2021-07-18 18:04:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-21 14:25:30
 * @Description:
 */
import Home from '@/view/dashboard';
import SiteList from '@/view/dashboard/site/siteList';
import InterfaceDom from '@/view/dashboard/interface/interface';

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
    children: [
      {
        path: 'siteList',
        element: <SiteList />,
      },
      {
        path: 'interface/:id',
        element: <InterfaceDom />,
      },
    ],
  },
];

export default routes;
