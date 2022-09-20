import { CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';
import Home from '@/view/dashboard/Index';

import CLI_LOGO from '@/assets/images/cli-logo.png';
import COMPONENT_LOGO from '@/assets/images/component-logo.png';
import DESIGN_LOGO from '@/assets/images/design-logo.png';
import DEVOPS_LOGO from '@/assets/images/devops-logo.png';

export default {
  title: 'HouS',
  logo: DESIGN_LOGO,
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: '欢迎',
        icon: <SmileFilled />,
        component: './Welcome',
      },
      {
        path: '/admin',
        name: '管理页',
        icon: <CrownFilled />,
        access: 'canAdmin',
        component: './Admin',
      },
      {
        name: '列表页',
        icon: <TabletFilled />,
        path: '/list',
        component: './ListTableList',
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: DESIGN_LOGO,
      title: '火石设计 HuoS',
      desc: '基于接口管理的低代码生成器',
      url: 'https://github.com/boty-design',
    },
    {
      icon: CLI_LOGO,
      title: 'BOTY CLI',
      desc: '插件式 CLI， 打造你的专属工具',
      url: 'https://antv.vision/',
      target: '_blank',
    },
    {
      icon: COMPONENT_LOGO,
      title: 'BOTY DESIGN',
      desc: '基于 ANT DESIGN 的业务组件库',
      url: 'https://github.com/boty-design',
    },
    {
      icon: DEVOPS_LOGO,
      title: 'DEVOPS 平台',
      desc: '零成本集成项目的 DEVOPS 平台',
      url: 'https://umijs.org/zh-CN/docs',
    },
  ],
};
