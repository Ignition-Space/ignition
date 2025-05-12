'use client';

import React, { useEffect, useRef } from 'react';
import { themeColors } from '../lib/theme/themeConfig';

interface WaveBackgroundProps {
  theme?: 'light' | 'dark';
  waveCount?: number;
  speed?: number;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({
  theme = 'dark',
  waveCount = 5,
  speed = 0.02,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取当前主题颜色
    const colors = themeColors[theme].canvas;

    // 解析背景渐变
    let bgGradientColors: string[] = [];
    const gradientMatch = colors.background.match(
      /(from|via|to)-([a-z]+-\d+)/g,
    );
    if (gradientMatch) {
      bgGradientColors = gradientMatch.map((match) => {
        const colorKey = match.replace(/(from|via|to)-/, '');
        // 转换tailwind颜色名称为rgb
        if (colorKey === 'blue-50') return 'rgba(239, 246, 255, 0.8)';
        if (colorKey === 'blue-100') return 'rgba(219, 234, 254, 0.8)';
        if (colorKey === 'blue-200') return 'rgba(191, 219, 254, 0.8)';
        if (colorKey === 'blue-900') return 'rgba(30, 58, 138, 0.8)';
        if (colorKey === 'indigo-100') return 'rgba(224, 231, 255, 0.8)';
        if (colorKey === 'indigo-800') return 'rgba(55, 48, 163, 0.8)';
        if (colorKey === 'slate-900') return 'rgba(15, 23, 42, 0.8)';
        return 'rgba(59, 130, 246, 0.8)'; // 默认蓝色
      });
    }

    // 如果没有解析出颜色，使用默认颜色
    if (bgGradientColors.length === 0) {
      bgGradientColors =
        theme === 'dark'
          ? [
            'rgba(15, 23, 42, 0.8)',
            'rgba(30, 58, 138, 0.8)',
            'rgba(55, 48, 163, 0.8)',
          ]
          : [
            'rgba(239, 246, 255, 0.8)',
            'rgba(219, 234, 254, 0.8)',
            'rgba(191, 219, 254, 0.8)',
          ];
    }

    // 设置画布尺寸
    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 波浪参数
    const waves = Array.from({ length: waveCount }, (_, i) => ({
      amplitude: Math.random() * 20 + 10, // 振幅
      wavelength: Math.random() * 200 + 100, // 波长
      speed: (Math.random() * 0.05 + 0.01) * speed, // 速度
      phase: Math.random() * Math.PI * 2, // 相位
      color: bgGradientColors[i % bgGradientColors.length],
      height: canvas.height * (0.5 + 0.1 * i),
    }));

    // 绘制波浪
    const drawWaves = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradientColors.forEach((color, index) => {
        gradient.addColorStop(index / (bgGradientColors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制每一层波浪
      waves.forEach((wave, index) => {
        ctx.beginPath();

        // 更新相位
        wave.phase += wave.speed;

        // 开始于左边缘稍下方
        ctx.moveTo(0, wave.height);

        // 绘制波浪线
        for (let x = 0; x < canvas.width; x += 10) {
          const y =
            wave.height +
            Math.sin(x / wave.wavelength + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        // 封闭路径到画布底部和左侧
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // 填充波浪
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // 添加一些透明的圆形作为泡沫效果
      const bubbleCount = 12;
      for (let i = 0; i < bubbleCount; i++) {
        const x = ((Math.sin(time * 0.001 + i) + 1) * canvas.width) / 2;
        const y = canvas.height - (Math.cos(time * 0.0015 + i * 0.3) + 1) * 80;
        const radius = Math.random() * 4 + 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(() =>
        drawWaves(time + 16),
      );
    };

    drawWaves(0);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme, waveCount, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default WaveBackground;
