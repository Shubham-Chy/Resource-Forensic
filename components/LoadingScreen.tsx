
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
      <div className="autography text-6xl md:text-8xl text-white mb-8 animate-pulse">
        Resource Forensic
      </div>
      <div className="w-48 h-[1px] bg-white/20 relative overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-[10px] tracking-[0.3em] uppercase opacity-50">
        Extracting Premium Data... {progress}%
      </div>
    </div>
  );
};

export default LoadingScreen;
