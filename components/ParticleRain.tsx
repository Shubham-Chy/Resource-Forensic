
import React, { useEffect, useRef } from 'react';

// Fix: Define props interface to include isDarkMode
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
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 3 + 2;
        this.opacity = Math.random() * 0.15 + 0.05;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.y = -this.length;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        // Fix: Adjust particle color based on theme
        const color = isDarkMode ? '255, 255, 255' : '0, 0, 0';
        ctx.strokeStyle = `rgba(${color}, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      particles = Array.from({ length: count }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
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
  }, [isDarkMode]); // Re-initialize on theme change

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: isDarkMode ? 'screen' : 'multiply' }}
    />
  );
};

export default ParticleRain;
