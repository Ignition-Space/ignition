/*
 * @Author: Cookie
 * @Date: 2021-07-18 18:04:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-19 15:36:37
 * @Description:
 */
import { CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';
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

// const route = {
//   path: '/',
//   routes: [
//     {
//       path: '/',
//       name: '欢迎',
//       icon: <SmileFilled />,
//       component: './Welcome',
//     },
//     {
//       path: '/admin',
//       name: '管理页',
//       icon: <CrownFilled />,
//       access: 'canAdmin',
//       component: './Admin',
//       routes: [
//         {
//           path: '/admin/sub-page1',
//           name: '一级页面',
//           icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
//           component: './Welcome',
//         },
//         {
//           path: '/admin/sub-page2',
//           name: '二级页面',
//           icon: <CrownFilled />,
//           component: './Welcome',
//         },
//         {
//           path: '/admin/sub-page3',
//           name: '三级页面',
//           icon: <CrownFilled />,
//           component: './Welcome',
//         },
//       ],
//     },
//     {
//       name: '列表页',
//       icon: <TabletFilled />,
//       path: '/list',
//       component: './ListTableList',
//       routes: [
//         {
//           path: '/list/sub-page',
//           name: '列表页面',
//           icon: <CrownFilled />,
//           routes: [
//             {
//               path: 'sub-sub-page1',
//               name: '一一级列表页面',
//               icon: <CrownFilled />,
//               component: './Welcome',
//             },
//             {
//               path: 'sub-sub-page2',
//               name: '一二级列表页面',
//               icon: <CrownFilled />,
//               component: './Welcome',
//             },
//             {
//               path: 'sub-sub-page3',
//               name: '一三级列表页面',
//               icon: <CrownFilled />,
//               component: './Welcome',
//             },
//           ],
//         },
//         {
//           path: '/list/sub-page2',
//           name: '二级列表页面',
//           icon: <CrownFilled />,
//           component: './Welcome',
//         },
//         {
//           path: '/list/sub-page3',
//           name: '三级列表页面',
//           icon: <CrownFilled />,
//           component: './Welcome',
//         },
//       ],
//     },
//   ],
// },

const routes = [
  {
    path: '/',
    element: <Home />,
    routes: {
      path: '/',
      name: '欢迎',
      icon: <SmileFilled />,
    },
  },
  {
    path: '/admin',
    name: '管理页',
    icon: <CrownFilled />,
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page1',
        name: '一级页面',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
      },
      {
        path: '/admin/sub-page2',
        name: '二级页面',
        icon: <CrownFilled />,
      },
      {
        path: '/admin/sub-page3',
        name: '三级页面',
        icon: <CrownFilled />,
      },
    ],
  },
];

export default routes;
