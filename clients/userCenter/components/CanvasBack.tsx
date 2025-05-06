'use client';

import React, { useEffect, useRef } from 'react';

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
}

const CanvasBack: React.FC<CanvasBackProps> = ({ row = 12, col = 8 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

        // 绘制点
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
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
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
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
  }, [row, col]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
};

export default CanvasBack;
