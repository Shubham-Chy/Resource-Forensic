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
        this.w = 5 + Math.random() * 7;
        this.h = 3 + Math.random() * 4;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.015; // Slower flipping
        this.horizontalSpeed = Math.random() * 0.6 - 0.3; // Gentle horizontal drift
        this.verticalSpeed = 0.4 + Math.random() * 0.7; // Significantly slower falling
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.01; // Slower rotation
        
        // Forensic shades: Pure white and various grays
        const colors = isDarkMode 
          ? ['rgba(255, 255, 255, ', 'rgba(200, 200, 200, ', 'rgba(150, 150, 150, ']
          : ['rgba(255, 255, 255, ', 'rgba(220, 220, 220, ', 'rgba(180, 180, 180, '];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.verticalSpeed;
        this.x += this.horizontalSpeed + Math.sin(this.flip) * 0.3;
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
        // Sakura petal geometry
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.w / 2, -this.h, this.w, 0, 0, this.h);
        ctx.bezierCurveTo(-this.w, 0, -this.w / 2, -this.h, 0, 0);
        
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const initPetals = () => {
      // Reduced quantity: divisor increased to 35000 from 12000
      const count = Math.floor((canvas.width * canvas.height) / 35000);
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