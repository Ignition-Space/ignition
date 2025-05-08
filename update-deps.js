#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 更新主项目依赖
function updateRootDependencies() {
  console.log('正在更新根项目依赖...');
  try {
    // 获取最新的依赖版本信息
    execSync('pnpm outdated --json > outdated.json', { stdio: 'inherit' });

    // 更新依赖
    execSync('pnpm update --save', { stdio: 'inherit' });
    execSync('pnpm update --save-dev', { stdio: 'inherit' });

    console.log('根项目依赖更新完成！');
  } catch (error) {
    console.error('更新根项目依赖时出错:', error.message);
  }
}

// 更新子项目依赖
function updateSubprojectDependencies(projectPath) {
  if (!fs.existsSync(path.join(projectPath, 'package.json'))) {
    return;
  }

  console.log(`正在更新 ${projectPath} 依赖...`);
  try {
    // 切换到子项目目录
    process.chdir(projectPath);

    // 获取最新的依赖版本信息
    execSync('pnpm outdated --json > outdated.json', { stdio: 'inherit' });

    // 更新依赖
    execSync('pnpm update --save', { stdio: 'inherit' });
    execSync('pnpm update --save-dev', { stdio: 'inherit' });

    console.log(`${projectPath} 依赖更新完成！`);

    // 切回根目录
    process.chdir(process.env.INIT_CWD || path.resolve(__dirname));
  } catch (error) {
    console.error(`更新 ${projectPath} 依赖时出错:`, error.message);
    // 确保回到根目录
    process.chdir(process.env.INIT_CWD || path.resolve(__dirname));
  }
}

// 查找所有客户端和服务端项目
function findAllProjects() {
  const projects = [];

  // 查找客户端项目
  if (fs.existsSync('clients')) {
    fs.readdirSync('clients').forEach(client => {
      const clientPath = path.join('clients', client);
      if (fs.statSync(clientPath).isDirectory()) {
        projects.push(clientPath);
      }
    });
  }

  // 查找服务端项目
  if (fs.existsSync('apps')) {
    fs.readdirSync('apps').forEach(app => {
      const appPath = path.join('apps', app);
      if (fs.statSync(appPath).isDirectory()) {
        projects.push(appPath);
      }
    });
  }

  return projects;
}

// 主函数
function main() {
  console.log('开始更新所有项目依赖...');

  // 保存初始目录
  process.env.INIT_CWD = process.cwd();

  // 更新根项目依赖
  updateRootDependencies();

  // 查找所有子项目
  const projects = findAllProjects();

  // 更新所有子项目依赖
  projects.forEach(projectPath => {
    updateSubprojectDependencies(projectPath);
  });

  console.log('所有项目依赖更新完成！');
}

main(); 