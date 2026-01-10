
import React from 'react';

interface SumiBackgroundProps {
  isDarkMode: boolean;
}

const SumiBackground: React.FC<SumiBackgroundProps> = ({ isDarkMode }) => {
  // We only show this in dark mode as requested, or highly attenuated in light mode.
  if (!isDarkMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.07] mix-blend-screen animate-in fade-in duration-1000">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="inkBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ink" />
          </filter>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.1" />
              <feFuncG type="linear" slope="0.1" />
              <feFuncB type="linear" slope="0.1" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Procedural Grain Layer */}
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.5" />

        {/* Brush Stroke 1 */}
        <path 
          d="M-100,200 C150,50 400,450 600,200 S900,100 1100,300" 
          stroke="white" 
          strokeWidth="120" 
          fill="none" 
          filter="url(#inkBlur)"
          className="animate-[inkFlow_25s_infinite_alternate]"
        />

        {/* Brush Stroke 2 */}
        <path 
          d="M1100,800 C800,950 500,600 300,800 S0,900 -100,700" 
          stroke="white" 
          strokeWidth="180" 
          fill="none" 
          filter="url(#inkBlur)"
          className="animate-[inkFlow_30s_infinite_alternate-reverse]"
        />

        {/* Vertical Stroke (Bamboo style) */}
        <path 
          d="M200,-100 Q150,500 250,1100" 
          stroke="white" 
          strokeWidth="80" 
          fill="none" 
          filter="url(#inkBlur)"
          opacity="0.6"
        />
        
        <path 
          d="M800,-100 Q850,500 750,1100" 
          stroke="white" 
          strokeWidth="100" 
          fill="none" 
          filter="url(#inkBlur)"
          opacity="0.4"
        />
      </svg>

      <style>{`
        @keyframes inkFlow {
          0% { transform: translate(-20px, -20px) scale(1); }
          100% { transform: translate(20px, 20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default SumiBackground;
