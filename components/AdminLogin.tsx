
import React, { useState, useEffect, useRef } from 'react';

// Hardcoded credentials for direct comparison to ensure maximum reliability for the user
const ADMIN_ID = 'ResourceForensic@JaiMaataDiLetsRock';
const ADMIN_PWD = 'ChintapakDamDam';

const AdminLogin: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (eyeRef.current) {
        const rect = eyeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(8, Math.sqrt(dx * dx + dy * dy) / 40);
        setEyeOffset({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);

    // Using a timeout to simulate system processing / decryption
    setTimeout(() => {
      const normalizedInputId = id.trim().toLowerCase();
      const normalizedTargetId = ADMIN_ID.toLowerCase();
      const normalizedInputPwd = pwd.trim();
      
      if (normalizedInputId === normalizedTargetId && normalizedInputPwd === ADMIN_PWD) {
        setIsSuccess(true);
        setTimeout(() => {
          onAuth();
        }, 800);
      } else {
        setError(true);
        setIsVerifying(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-8 font-mono bg-[#050505] overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:40px_40px] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]" />

      <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        <div className="flex flex-col items-center">
          {/* Main Security Eye Tracking Cursor */}
          <div className="relative mb-12 flex flex-col items-center group">
             <div className="text-[7px] tracking-[0.8em] uppercase opacity-20 mb-4 font-black group-hover:opacity-40 transition-opacity">Biometric_Feed_Active</div>
             <div 
                ref={eyeRef}
                className={`w-36 h-20 border rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-white/[0.02] ${error ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : isSuccess ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10'}`}
              >
                <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] transition-colors ${error ? 'bg-red-500/20' : 'bg-white/5'}`} />
                <div 
                  className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-75 ease-out ${error ? 'border-red-500/40' : 'border-white/30'}`}
                  style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
                >
                  <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-colors ${error ? 'bg-red-500' : isSuccess ? 'bg-green-500' : 'bg-white'}`} />
                </div>
                {/* Scanner line */}
                <div className={`absolute top-0 left-0 w-full h-[1px] animate-[scan_2.5s_ease-in-out_infinite] ${error ? 'bg-red-500/40' : 'bg-white/20'}`} />
              </div>
          </div>

          <div className="text-center">
            <div className={`inline-block border px-6 py-2 text-[9px] tracking-[0.5em] uppercase mb-10 font-black transition-all ${error ? 'border-red-500 text-red-500 bg-red-500/10 animate-shake' : 'border-white/20 text-white/60 bg-white/5'}`}> 
              {error ? 'ACCESS_DENIED' : 'AUTHENTICATION_REQUIRED'} 
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">Vault_Portal</h2>
            <p className="text-[10px] opacity-20 tracking-[0.2em] uppercase text-white">Identity Verification Protocol_v4.2</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.4em] uppercase opacity-20 ml-1 font-black">Operator_ID</label>
            <input 
              type="text" 
              placeholder="RESOURCE_ID"
              className={`w-full bg-white/[0.03] border p-5 text-[13px] outline-none transition-all tracking-[0.1em] text-white rounded-sm focus:bg-white/[0.06] ${error ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'}`}
              value={id}
              onChange={e => setId(e.target.value)}
              disabled={isVerifying}
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.4em] uppercase opacity-20 ml-1 font-black">Security_Key</label>
            <div className="relative group">
              <input 
                type={showPwd ? "text" : "password"} 
                placeholder="CIPHER_ENTRY"
                className={`w-full bg-white/[0.03] border p-5 text-[13px] outline-none transition-all tracking-[0.1em] text-white rounded-sm focus:bg-white/[0.06] ${error ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'}`}
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                disabled={isVerifying}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors clickable p-2"
              >
                {showPwd ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 4.5 12 4.5c4.79 0 8.601 3.549 9.963 7.178.07.186.07.388 0 .574-1.362 3.529-5.174 7.078-9.963 7.078-4.79 0-8.601-3.549-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className={`clickable w-full py-6 font-black tracking-[0.8em] uppercase transition-all flex items-center justify-center gap-6 active:scale-[0.98] rounded-sm group overflow-hidden relative ${isSuccess ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
              disabled={isVerifying}
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-[95%] transition-transform duration-500 opacity-5" />
              {isVerifying ? (
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isSuccess ? 'border-white' : 'border-black'}`} />
                  <span className="opacity-60">{isSuccess ? 'Access_Granted' : 'Decrypting...'}</span>
                </div>
              ) : 'Unlock_Vault'}
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center opacity-10 text-[8px] tracking-[0.5em] uppercase font-black pt-10 border-t border-white/5">
           <span>ENCRYPTION: AES_256</span>
           <span>STATUS: ACTIVE</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(80px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
