/*
 * @Author: Cookie
 * @Description: 数据库链接配置
 */

import { DataSource, DataSourceOptions } from 'typeorm';

import { getConfig } from '../utils/index'
import { NamingStrategy } from './naming.strategies';

import * as path from 'path'

const { MONGODB_CONFIG, MYSQL_CONFIG } = getConfig()

// 静态文件处理与 webpack hmr 热更新冲突
const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  NamedNodeMap: new NamingStrategy(),
  entities: [path.join(__dirname, `../../../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`)], // 自动加载实体
  // entities: [PageConfig]
}

const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  NamedNodeMap: new NamingStrategy(),
  entities: [path.join(__dirname, `../../../../**/*.${MYSQL_CONFIG.entities}.entity{.ts,.js}`)],
  // entities: [Privilege, Resource, Role, RolePrivilege, System, User, UserRole]
}

const MONGODB_DATA_SOURCE = new DataSource(MONGODB_DATABASE_CONFIG)
const MYSQL_DATA_SOURCE = new DataSource(MYSQL_DATABASE_CONFIG)

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    useFactory: async () => {
      if (!MONGODB_DATA_SOURCE.isInitialized) await MONGODB_DATA_SOURCE.initialize()
      return MONGODB_DATA_SOURCE
    }
  },
  {
    provide: 'MYSQL_DATA_SOURCE',
    useFactory: async () => {
      if (!MYSQL_DATA_SOURCE.isInitialized) await MYSQL_DATA_SOURCE.initialize()
      return MYSQL_DATA_SOURCE
    }
  },
];
