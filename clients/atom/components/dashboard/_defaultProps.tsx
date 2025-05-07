import {
  CrownFilled,
  GroupOutlined,
  SmileFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';

export default {
  title: 'HuoS',
  logo: '/images/design-logo.png',
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: '欢迎',
        icon: <SmileFilled />,
      },
      {
        path: '/',
        name: '管理页',
        icon: <GroupOutlined />,
        routes: [
          {
            path: '/dashboard/site',
            name: '站点列表',
            key: 'siteList',
            icon: <UnorderedListOutlined />,
            routes: [
              {
                path: '/dashboard/interface/:id',
                name: '接口列表',
                hideInMenu: true,
                parentKeys: 'siteList',
              },
            ],
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: '/images/design-logo.png',
      title: '火石设计 HuoS',
      desc: '基于接口管理的低代码生成器',
      url: 'https://github.com/boty-design',
    },
    {
      icon: '/images/cli-logo.png',
      title: 'BOTY CLI',
      desc: '插件式 CLI， 打造你的专属工具',
      url: 'https://antv.vision/',
      target: '_blank',
    },
    {
      icon: '/images/component-logo.png',
      title: 'BOTY DESIGN',
      desc: '基于 ANT DESIGN 的业务组件库',
      url: 'https://github.com/boty-design',
    },
    {
      icon: '/images/devops-logo.png',
      title: 'DEVOPS 平台',
      desc: '零成本集成项目的 DEVOPS 平台',
      url: 'https://umijs.org/zh-CN/docs',
    },
  ],
}; 