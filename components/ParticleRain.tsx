import React, { useEffect, useRef } from 'react';

interface ParticleRainProps {
  isDarkMode?: boolean;
}

const ParticleRain: React.FC<ParticleRainProps> = ({ isDarkMode = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPetals();
    };

    class Petal {
      x: number;
      y: number;
      w: number;
      h: number;
      opacity: number;
      flip: number;
      flipSpeed: number;
      horizontalSpeed: number;
      verticalSpeed: number;
      rotation: number;
      rotationSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.w = 6 + Math.random() * 8;
        this.h = 4 + Math.random() * 4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.03;
        this.horizontalSpeed = Math.random() * 2 - 1;
        this.verticalSpeed = 1 + Math.random() * 1.5;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.02;
        
        // Sakura shades: Soft pinks and whites
        const colors = isDarkMode 
          ? ['rgba(255, 182, 193, ', 'rgba(255, 255, 255, ', 'rgba(255, 218, 224, ']
          : ['rgba(255, 105, 180, ', 'rgba(255, 182, 193, ', 'rgba(255, 192, 203, '];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.verticalSpeed;
        this.x += this.horizontalSpeed + Math.sin(this.flip) * 0.5;
        this.flip += this.flipSpeed;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas!.height) {
          this.y = -20;
          this.x = Math.random() * canvas!.width;
        }
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(Math.sin(this.flip), 1);
        
        ctx.beginPath();
        // Drawing a petal shape (teardrop/heart-like)
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.w / 2, -this.h, this.w, 0, 0, this.h);
        ctx.bezierCurveTo(-this.w, 0, -this.w / 2, -this.h, 0, 0);
        
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const initPetals = () => {
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      petals = Array.from({ length: count }, () => new Petal());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default ParticleRain;