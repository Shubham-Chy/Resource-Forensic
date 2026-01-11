import React, { useEffect, useState, useCallback } from 'react';

interface SecurityGateProps {
  disabled?: boolean;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ disabled = false }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const performAdvancedCheck = useCallback(async () => {
    if (disabled) {
      setIsBlocked(false);
      return;
    }

    // Vector 1: Bait Element Visibility (Common AdBlock target)
    const bait = document.createElement('div');
    bait.innerHTML = '&nbsp;';
    bait.className = 'adsbox ad-container ad-placement ad-header pub_300x250';
    bait.style.cssText = 'position:absolute; top:-1000px; left:-1000px; width:1px; height:1px;';
    document.body.appendChild(bait);

    // Vector 2: Script Blocking (Google Ads Script)
    const scriptCheck = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.onload = () => resolve(false);
      script.onerror = () => resolve(true);
      document.head.appendChild(script);
      setTimeout(() => {
        if (document.head.contains(script)) document.head.removeChild(script);
        resolve(true); 
      }, 1500);
    });

    // Vector 3: Network Request Interception
    const networkCheck = async () => {
      try {
        await fetch('https://securepubads.g.doubleclick.net/gampad/ads', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        });
        return false; 
      } catch (e) {
        return true; 
      }
    };

    const isHidden = 
      window.getComputedStyle(bait).display === 'none' || 
      window.getComputedStyle(bait).visibility === 'hidden' || 
      bait.offsetParent === null || 
      bait.offsetHeight === 0;
    
    const scriptFailed = await scriptCheck;
    const networkFailed = await networkCheck();

    const detected = isHidden || scriptFailed || networkFailed;

    setIsBlocked(detected as boolean);
    if (document.body.contains(bait)) document.body.removeChild(bait);
    
    // Lock scroll if blocked
    document.body.style.overflow = (detected && !disabled) ? 'hidden' : 'auto';
  }, [disabled]);

  useEffect(() => {
    performAdvancedCheck();
    const interval = setInterval(performAdvancedCheck, 5000);

    // Integrity Guard: Detection of element removal via DevTools
    const observer = new MutationObserver(() => {
      const gateIsActive = !!document.querySelector('[data-forensic-overlay="security-gate"]');
      if (isBlocked && !gateIsActive && !disabled) {
        window.location.reload(); 
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [isBlocked, disabled, performAdvancedCheck]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRefreshing(true);
    // Simulate re-scan
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  if (!isBlocked || disabled) return null;

  return (
    <div 
      data-forensic-overlay="security-gate"
      className="fixed inset-0 z-[10000] bg-[#050505] text-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden animate-in fade-in duration-700"
    >
      {/* Forensic Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:30px_30px] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]" />
      
      {/* Red Restricted Overlay Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]" />

      {/* Floating Kanjis (Decor) */}
      <div className="absolute top-10 left-10 text-[60px] font-black opacity-[0.02] select-none vertical-text">
        立入禁止
      </div>
      <div className="absolute bottom-10 right-10 text-[60px] font-black opacity-[0.02] select-none vertical-text">
        警告
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="flex flex-col items-center gap-12 text-center">
          
          {/* Header Status */}
          <div className="space-y-6">
             <div className="flex items-center justify-center gap-6 mb-4">
                <div className="h-[2px] w-16 bg-red-600/30" />
                <div className="text-[11px] tracking-[0.8em] uppercase font-black text-red-500 animate-pulse">FILTER_SHIELD_DETECTED</div>
                <div className="h-[2px] w-16 bg-red-600/30" />
             </div>
             
             <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none flex flex-col items-center">
               <span className="opacity-10 scale-90 mb-[-10px]">ACCESS</span>
               <span className="text-red-600">REDACTED</span>
               <span className="text-4xl md:text-6xl mt-4 tracking-[0.2em] font-black">立入禁止</span>
             </h2>
             
             <p className="text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-bold opacity-30 mt-10 max-w-lg mx-auto leading-loose">
               AD-BLOCKING AGENTS HAVE COMPROMISED THE FORENSIC INTEGRITY OF THIS TERMINAL. TO DECODE THE ARCHIVE, ALL EXTERNAL INTERFERENCE MUST BE NEUTRALIZED.
             </p>
          </div>

          {/* Biometric/Handshake visual */}
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 border border-dashed border-red-600/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="flex flex-col items-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-red-600 mb-2">
                     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                     <path d="M12 8v4" />
                     <path d="M12 16h.01" />
                  </svg>
                  <span className="text-[8px] tracking-[0.5em] font-black opacity-20 uppercase">PROTOCOL_ERROR</span>
               </div>
            </div>
          </div>

          {/* Interactive Button */}
          <div className="flex flex-col items-center gap-8 mt-4 w-full">
             <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`clickable group relative w-full max-w-sm flex flex-col items-center px-12 py-8 border transition-all overflow-hidden ${isRefreshing ? 'border-white/10 opacity-50 pointer-events-none' : 'border-red-600/40 hover:bg-white hover:text-black hover:border-white'}`}
             >
                <div className="absolute inset-0 bg-red-600/5 group-hover:opacity-0 transition-opacity" />
                <span className="text-[13px] font-black tracking-[1em] uppercase mb-2 relative z-10">
                  {isRefreshing ? 'SYNCHRONIZING...' : 'RE_SCAN_SYSTEM'}
                </span>
                <span className="text-[8px] font-black tracking-[0.3em] opacity-40 uppercase relative z-10">
                   {isRefreshing ? 'WAITING FOR DATA HANDSHAKE' : '再スキャン接続'}
                </span>
                
                {/* Visual scanline effect in button */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1 w-full top-[-10%] group-hover:animate-[scan_1s_infinite] pointer-events-none" />
             </button>
             
             <div className="flex items-center gap-6 opacity-10">
                <span className="text-[8px] font-black tracking-[0.5em] uppercase">ID: ERR_SHIELD_V4</span>
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span className="text-[8px] font-black tracking-[0.5em] uppercase">AUTHENTICATION_STALLED</span>
             </div>
          </div>
        </div>
      </div>

      {/* CRT Scanline + Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
      
      <style>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
};

export default SecurityGate;