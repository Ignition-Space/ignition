// Bolt网站主题配置
// 参考https://support.bolt.new/home

// 主题颜色配置
export const themeColors = {
  // 亮色模式
  light: {
    primary: '#0073E6', // 蓝色主色调
    secondary: '#6B7280', // 次要色
    success: '#10B981', // 成功色
    warning: '#FBBF24', // 警告色
    danger: '#EF4444', // 危险色
    info: '#3B82F6', // 信息色
    background: '#FFFFFF', // 背景色
    card: '#F9FAFB', // 卡片背景
    text: {
      primary: '#111827', // 主要文本颜色
      secondary: '#6B7280', // 次要文本颜色
      muted: '#9CA3AF', // 弱化文本颜色
    },
    border: '#E5E7EB', // 边框颜色
    divider: '#E5E7EB', // 分隔线颜色
    canvas: {
      background: 'from-blue-50 via-indigo-100 to-blue-200',
      dot: 'rgba(59, 130, 246, 0.5)', // 点的颜色
      line: 'rgba(59, 130, 246, 0.3)', // 线的颜色
    },
  },
  // 深色模式
  dark: {
    primary: '#3B82F6', // 蓝色主色调
    secondary: '#6B7280', // 次要色
    success: '#10B981', // 成功色
    warning: '#FBBF24', // 警告色
    danger: '#EF4444', // 危险色
    info: '#60A5FA', // 信息色
    background: '#111827', // 背景色
    card: '#1F2937', // 卡片背景
    text: {
      primary: '#F9FAFB', // 主要文本颜色
      secondary: '#D1D5DB', // 次要文本颜色
      muted: '#9CA3AF', // 弱化文本颜色
    },
    border: '#374151', // 边框颜色
    divider: '#374151', // 分隔线颜色
    canvas: {
      background: 'from-slate-900 via-blue-900 to-indigo-800',
      dot: 'rgba(255, 255, 255, 0.5)', // 点的颜色
      line: 'rgba(255, 255, 255, 0.3)', // 线的颜色
    },
  },
};

// 获取当前主题色
export const getCurrentThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? themeColors.dark : themeColors.light;
};
