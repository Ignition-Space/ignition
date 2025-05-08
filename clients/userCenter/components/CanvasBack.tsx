'use client';

import React, { useEffect, useRef, useState } from 'react';
import { themeColors } from '../lib/theme/themeConfig';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface CanvasBackProps {
  row?: number;
  col?: number;
  theme?: 'light' | 'dark';
}

const CanvasBack: React.FC<CanvasBackProps> = ({
  row = 12,
  col = 8,
  theme = 'dark',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const frameRef = useRef<number>(0);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(theme);

  useEffect(() => {
    // 当传入的theme属性变化时更新
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 如果没有明确指定theme属性，则跟随系统主题
      if (theme === undefined) {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取当前主题的颜色配置
    const colors = themeColors[currentTheme].canvas;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      initPoints();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 初始化点
    function initPoints() {
      const points: Point[] = [];
      // 使用非空断言，因为已经在上面检查了canvas不为null
      const width = canvas!.width;
      const height = canvas!.height;
      const gap = {
        x: width / (col - 1),
        y: height / (row - 1),
      };

      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          points.push({
            x: j * gap.x,
            y: i * gap.y,
            vx: Math.random() * 1 - 0.5,
            vy: Math.random() * 1 - 0.5,
            radius: Math.random() * 2 + 1,
          });
        }
      }

      pointsRef.current = points;
    }

    // 动画
    function animate() {
      if (!ctx) return;
      // 使用非空断言，因为已经在上面检查了canvas不为null
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // 更新点的位置
      const points = pointsRef.current;
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        point.x += point.vx;
        point.y += point.vy;

        // 边界检查
        if (point.x < 0 || point.x > canvas!.width) {
          point.vx = -point.vx;
        }
        if (point.y < 0 || point.y > canvas!.height) {
          point.vy = -point.vy;
        }

        // 使用主题颜色绘制点
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.dot;
        ctx.fill();

        // 连接点
        for (let j = i + 1; j < points.length; j++) {
          const nextPoint = points[j];
          const distance = Math.sqrt(
            Math.pow(point.x - nextPoint.x, 2) +
            Math.pow(point.y - nextPoint.y, 2),
          );

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.strokeStyle = `rgba(${colors.line}, ${1 - distance / 150})`;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [row, col, currentTheme]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
};

export default CanvasBack;
