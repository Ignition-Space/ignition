/** 根路由 **/

import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import Loading from '@/components/Loading';
import Dashboard from '@/pages/Dashboard';
import BasicLayout from '@/layouts/BasicLayout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AuthProvider,
    children: [
      {
        path: 'login',
        Component: lazy(() => import('@/pages/Login')),
      },
      {
        path: '/',
        Component: BasicLayout,
        children: [
          {
            path: '',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            Component: Dashboard,
          },
          {
            path: 'privilege',
            Component: lazy(() => import('@/pages/Privilege')),
          },
          {
            path: 'resource',
            Component: lazy(() => import('@/pages/Resource')),
          },
          {
            path: 'role',
            Component: lazy(() => import('@/pages/Role')),
          },
          {
            path: 'user',
            Component: lazy(() => import('@/pages/User')),
          },
          {
            path: 'system',
            Component: lazy(() => import('@/pages/System')),
          },
        ],
      },
    ],
  },
]);

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Router;
