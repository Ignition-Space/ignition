'use client';

import React, { useEffect, useRef } from 'react';
import { themeColors } from '../lib/theme/themeConfig';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

interface ParticleBackgroundProps {
  theme?: 'light' | 'dark';
  particleCount?: number;
  connectDistance?: number;
  mouseInteraction?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  theme = 'dark',
  particleCount = 70,
  connectDistance = 150,
  mouseInteraction = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取当前主题颜色
    const colors = themeColors[theme];

    // 设置画布尺寸
    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      initParticles();
    };

    // 处理鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseInteraction) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    // 处理鼠标离开
    const handleMouseLeave = () => {
      if (mouseInteraction) {
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;
      }
    };

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = [];

      // 根据主题选择合适的粒子颜色
      const particleColors =
        theme === 'dark'
          ? ['#ffffff', '#bbbbff', '#8888ff', '#aaaaff']
          : ['#0073E6', '#3B82F6', '#60A5FA', '#93C5FD'];

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        const color =
          particleColors[Math.floor(Math.random() * particleColors.length)];

        particlesRef.current.push({
          x,
          y,
          size,
          color,
          speedX,
          speedY,
        });
      }
    };

    // 更新和绘制
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 设置背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

      if (theme === 'dark') {
        gradient.addColorStop(0, '#111827');
        gradient.addColorStop(1, '#1E3A8A');
      } else {
        gradient.addColorStop(0, '#EFF6FF');
        gradient.addColorStop(1, '#DBEAFE');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particlesRef.current.forEach((particle, i) => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }

        // 鼠标交互
        if (mouseInteraction && mouseRef.current.x > 0) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRef.current.radius) {
            const angle = Math.atan2(dy, dx);
            const force =
              (mouseRef.current.radius - distance) / mouseRef.current.radius;

            particle.x += Math.cos(angle) * force;
            particle.y += Math.sin(angle) * force;
          }
        }

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // 连接粒子
        particlesRef.current.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectDistance) {
              ctx.beginPath();
              ctx.strokeStyle =
                theme === 'dark'
                  ? `rgba(255, 255, 255, ${1 - distance / connectDistance})`
                  : `rgba(59, 130, 246, ${1 - distance / connectDistance})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme, particleCount, connectDistance, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleBackground;
