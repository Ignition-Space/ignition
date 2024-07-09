import { parse } from 'yaml';

import * as path from 'path';
import * as fs from 'fs';

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

// 读取项目配置
export const getConfig = (type?: string) => {
  const environment = getEnv() || 'dev';
  const yamlPath = path.join(process.cwd(), `./.config/.${environment}.yaml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  if (type) {
    return config[type];
  }
  return config;
};

export const compareVersions = (version1, version2) => {
  const v1 = version1.split('.');
  const v2 = version2.split('.');

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = parseInt(v1[i] || 0);
    const num2 = parseInt(v2[i] || 0);
    if (num1 < num2) {
      return false;
    } else if (num1 > num2) {
      return true;
    }
  }
  return false;
};