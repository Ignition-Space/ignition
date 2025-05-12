#!/bin/bash

# 颜色设置
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 输出彩色消息
echo_success() {
  echo -e "${GREEN}$1${NC}"
}

echo_info() {
  echo -e "${BLUE}$1${NC}"
}

echo_warning() {
  echo -e "${YELLOW}$1${NC}"
}

echo_error() {
  echo -e "${RED}$1${NC}"
}

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
  echo_error "pnpm 未安装。请先安装 pnpm."
  echo_info "你可以使用 npm install -g pnpm 来安装"
  exit 1
fi

# 获取当前pnpm版本
PNPM_VERSION=$(pnpm -v)
echo_info "当前 pnpm 版本: $PNPM_VERSION"

# 更新根项目依赖
echo_info "1. 正在更新根项目依赖..."
pnpm update --latest

# 更新客户端项目依赖
echo_info "2. 正在更新客户端项目依赖..."
CLIENT_PROJECTS=(
  "clients/userCenter"
  "clients/atom"
)

for project in "${CLIENT_PROJECTS[@]}"; do
  if [ -d "$project" ]; then
    echo_info "   正在更新 $project..."
    (cd "$project" && pnpm update --latest)
  else
    echo_warning "   目录不存在: $project"
  fi
done

# 更新服务端项目依赖
echo_info "3. 正在更新服务端项目依赖..."
SERVER_PROJECTS=(
  "apps/ignitionServer"
  "apps/userServer" 
  "apps/materialsServer"
  "apps/devopsServer"
)

for project in "${SERVER_PROJECTS[@]}"; do
  if [ -d "$project" ]; then
    echo_info "   正在更新 $project..."
    (cd "$project" && pnpm update --latest)
  else
    echo_warning "   目录不存在: $project"
  fi
done

# 清理并重新安装所有依赖
echo_info "4. 清理并重新安装所有依赖..."
pnpm install

# 验证项目构建
echo_info "5. 验证项目构建..."
pnpm run build

echo_success "✅ 依赖更新完成!"
echo_info "你可以运行以下命令来测试各个项目:"
echo_info "  - 用户中心: pnpm run dev:user"
echo_info "  - Atom编辑器: pnpm run dev:atom"
echo_info "  - 全部项目: pnpm run dev" 