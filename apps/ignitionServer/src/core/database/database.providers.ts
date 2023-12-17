/*
 * @Author: Cookie
 * @Description: 数据库链接配置
 */

import { DataSource } from 'typeorm';

import { getConfig } from '../../utils/index';
import { NamingStrategy } from './naming.strategies';
import { Site } from '../../site/site.mongo.entity';
import { Page } from '../../pages/page.mongo.entity';
import { PageConfig } from '../../pages/config/pageConfig.mongo.entity';
import { Interface } from '../../site/interface/interface.mongo.entity';

import * as path from 'path';

const { MONGODB_CONFIG, MYSQL_CONFIG, MYSQL_DEVOPS_CONFIG } = getConfig();

console.log('MONGODB_CONFIG====>', MONGODB_CONFIG);

// 静态文件处理与 webpack hmr 热更新冲突
const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  entities: [Site, Page, PageConfig, Interface],
};

console.log(MONGODB_DATABASE_CONFIG);

const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  namingStrategy: new NamingStrategy(),
  entities: [
    path.join(__dirname, `/../../**/*.${MYSQL_CONFIG.entities}.entity.js`),
  ],
};

const MYSQL_DEVOPS_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  namingStrategy: new NamingStrategy(),
  entities: [
    path.join(
      __dirname,
      `/../../**/*.${MYSQL_DEVOPS_CONFIG.entities}.entity.js`,
    ),
  ],
};

const MONGODB_DATA_SOURCE = new DataSource(MONGODB_DATABASE_CONFIG);
const MYSQL_DATA_SOURCE = new DataSource(MYSQL_DATABASE_CONFIG);
const MYSQL_DEVOPS_DATA_SOURCE = new DataSource(MYSQL_DEVOPS_DATABASE_CONFIG);

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    useFactory: async () => {
      if (!MONGODB_DATA_SOURCE.isInitialized)
        await MONGODB_DATA_SOURCE.initialize();
      return MONGODB_DATA_SOURCE;
    },
  },
  {
    provide: 'MYSQL_DATA_SOURCE',
    useFactory: async () => {
      if (!MYSQL_DATA_SOURCE.isInitialized)
        await MYSQL_DATA_SOURCE.initialize();
      return MYSQL_DATA_SOURCE;
    },
  },
  {
    provide: 'MYSQL_DEVOPS_DATA_SOURCE',
    useFactory: async () => {
      if (!MYSQL_DEVOPS_DATA_SOURCE.isInitialized)
        await MYSQL_DEVOPS_DATA_SOURCE.initialize();
      return MYSQL_DEVOPS_DATA_SOURCE;
    },
  },
];
