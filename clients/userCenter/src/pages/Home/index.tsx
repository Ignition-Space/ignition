/* 主页 */

import React from 'react';
import ImgLogo from '@/assets/ig-logo.jpg';

import './index.less';

export default function HomePageContainer(): JSX.Element {
  return (
    <div className="page-home all_nowarp">
      <div className="box">
        <div className="title">IG-User-Center</div>
        <div className="info">标准 BRAC 权限的用户管理系统</div>
      </div>
    </div>
  );
}
