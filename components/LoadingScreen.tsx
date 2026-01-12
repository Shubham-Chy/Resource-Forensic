import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsReady(true), 400);
          return 100;
        }
        // Random incremental speed for realistic extraction feeling
        const inc = Math.floor(Math.random() * 3) + 1;
        return Math.min(100, prev + inc);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="loading-screen-container"
      data-forensic-overlay="loading"
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center overflow-hidden transition-all duration-1000"
      style={{ cursor: isReady ? 'pointer' : 'none' }}
      onClick={() => isReady && onComplete()}
    >
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-12">
        {/* Title: Cursive/Script Font */}
        <div className="autography text-white text-5xl md:text-7xl mb-12 tracking-tight opacity-90">
          Resource Forensic
        </div>
        
        <div className="w-full flex flex-col items-center">
          {/* Minimalist Progress Line */}
          <div className="w-full max-w-[240px] h-[1px] bg-white/20 relative mb-4">
             <div 
               className="absolute inset-y-0 left-0 bg-white transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
             />
          </div>

          {/* Status Text: Extraction with % */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] tracking-[0.4em] uppercase font-light text-white opacity-40">
              {isReady ? 'AUTHENTICATION_READY' : `EXTRACTING PREMIUM DATA... ${progress}%`}
            </span>
            
            {isReady && (
               <div className="animate-pulse flex flex-col items-center">
                 <span className="text-[9px] tracking-[0.6em] text-white opacity-20 uppercase mt-4">CLICK TO INITIALIZE ARCHIVE</span>
                 <div className="w-1.5 h-1.5 bg-white/40 rounded-full mt-4" />
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle scanline overlay to keep forensic feel without distracting from the requested clean look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

export default LoadingScreen;