import React, { useState, useEffect, useRef } from "react";

// Hardcoded credentials
const ADMIN_ID = "ResourceForensic@JaiMaataDiLetsRock";
const ADMIN_PWD = "ChintapakDamDam";

const AdminLogin: React.FC<{ onAuth: () => void; onBack: () => void }> = ({
  onAuth,
  onBack,
}) => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  // Mouse tracking logic
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (eyeRef.current) {
        const rect = eyeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(18, Math.sqrt(dx * dx + dy * dy) / 35);
        setEyeOffset({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Natural Blink Logic
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Natural blink speed
    };

    const scheduleNextBlink = () => {
      const delay = Math.random() * 4000 + 2000; // Random interval between 2-6 seconds
      return setTimeout(() => {
        triggerBlink();
        scheduleNextBlink();
      }, delay);
    };

    const blinkTimer = scheduleNextBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);

    setTimeout(() => {
      const normalizedInputId = id.trim().toLowerCase();
      const normalizedTargetId = ADMIN_ID.toLowerCase();
      const normalizedInputPwd = pwd.trim();

      if (
        normalizedInputId === normalizedTargetId &&
        normalizedInputPwd === ADMIN_PWD
      ) {
        setIsSuccess(true);
        setTimeout(() => onAuth(), 800);
      } else {
        setError(true);
        setIsVerifying(false);
        // Force a blink on error as a "flinch" reaction
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 100);
      }
    }, 1500);
  };

  return (
    <div
      id="admin-login-area"
      className="fixed inset-0 z-[5000] flex items-center justify-center p-8 font-mono bg-[#050505] overflow-hidden"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:40px_40px] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]" />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-10 left-10 flex items-center gap-4 text-white/40 hover:text-white transition-all clickable group py-3 px-6 border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.02]"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-[10px] tracking-[0.4em] uppercase font-black">
          アーカイブに戻る // RETURN_TO_HOME
        </span>
      </button>

      <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        <div className="flex flex-col items-center">
          <div className="relative mb-12 flex flex-col items-center group">
            <div className="text-[7px] tracking-[0.8em] uppercase opacity-20 mb-6 font-black">
              BIOMETRIC_SCAN_INITIATED
            </div>

            {/* Hyper-Realistic Optical Sensor with Eyelids */}
            <div
              ref={eyeRef}
              className={`w-64 h-32 border-2 rounded-[50%_50%_50%_50%_/_75%_75%_25%_25%] flex items-center justify-center relative overflow-hidden transition-all duration-700 bg-[#0a0a0a] shadow-inner ${error ? "border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.15)]" : isSuccess ? "border-green-500/50 shadow-[0_0_60px_rgba(34,197,94,0.15)]" : "border-white/10"}`}
            >
              {/* Iris and Pupil Layer */}
              <div
                className="relative w-24 h-24 transition-all duration-100 ease-out"
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              >
                {/* Detailed Fibrous Iris Texture */}
                <div
                  className={`absolute inset-0 rounded-full border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,1)] transition-colors duration-1000 overflow-hidden ${error ? "bg-red-950" : isSuccess ? "bg-green-950" : "bg-[#121212]"}`}
                  style={{
                    backgroundImage: `
                           repeating-conic-gradient(from 0deg, rgba(255,255,255,0.08) 0deg 1deg, transparent 1deg 3deg),
                           radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)
                         `,
                  }}
                >
                  {/* Secondary fibrous layer */}
                  <div
                    className="absolute inset-0 opacity-20 animate-[spin_120s_linear_infinite]"
                    style={{
                      backgroundImage:
                        "repeating-conic-gradient(from 0deg, white 0deg 0.5deg, transparent 0.5deg 6deg)",
                    }}
                  />
                </div>

                {/* The Reactive Pupil */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full transition-all duration-300 shadow-2xl ${isVerifying ? "scale-[1.4]" : isSuccess ? "scale-[0.8]" : "scale-100"}`}
                />

                {/* Surface Reflections (Glint) */}
                <div className="absolute top-[12%] left-[12%] w-5 h-5 bg-white/20 rounded-full blur-[2px] pointer-events-none" />
                <div className="absolute top-[8%] left-[8%] w-2 h-2 bg-white/40 rounded-full blur-[0.5px] pointer-events-none" />
              </div>

              {/* --- REAL EYE BLINK SYSTEM --- */}
              {/* Upper Eyelid */}
              <div
                className={`absolute top-0 left-0 w-full h-1/2 bg-[#050505] border-b border-white/5 z-20 origin-top transition-transform duration-150 ease-in-out`}
                style={{ transform: isBlinking ? "scaleY(1)" : "scaleY(0)" }}
              />
              {/* Lower Eyelid */}
              <div
                className={`absolute bottom-0 left-0 w-full h-1/2 bg-[#050505] border-t border-white/5 z-20 origin-bottom transition-transform duration-150 ease-in-out`}
                style={{ transform: isBlinking ? "scaleY(1)" : "scaleY(0)" }}
              />

              {/* Sclera Shadowing (Corner shadows) */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] z-10 pointer-events-none" />
            </div>
          </div>

          <div className="text-center">
            <div
              className={`inline-block border px-6 py-2 text-[9px] tracking-[0.5em] uppercase mb-10 font-black transition-all ${error ? "border-red-500 text-red-500 bg-red-500/10 animate-shake" : "border-white/20 text-white/60 bg-white/5"}`}
            >
              {error ? "IDENTITY_REJECTED" : "BIOMETRIC_ID_REQUIRED"}
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">
              Vault_Portal
            </h2>
            <p className="text-[10px] opacity-20 tracking-[0.2em] uppercase text-white">
              Forensic_Retinal_Decoder_v4
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.4em] uppercase opacity-20 ml-1 font-black">
              Operator_Code
            </label>
            <input
              type="text"
              placeholder="RESOURCE_OPERATOR"
              className={`w-full bg-white/[0.03] border p-5 text-[13px] outline-none transition-all tracking-[0.1em] text-white rounded-sm focus:bg-white/[0.06] ${error ? "border-red-500/50" : "border-white/10 focus:border-white/30"}`}
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isVerifying}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.4em] uppercase opacity-20 ml-1 font-black">
              Security_Cipher
            </label>
            <div className="relative group">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="ACCESS_KEY_0x"
                className={`w-full bg-white/[0.03] border p-5 text-[13px] outline-none transition-all tracking-[0.1em] text-white rounded-sm focus:bg-white/[0.06] ${error ? "border-red-500/50" : "border-white/10 focus:border-white/30"}`}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                disabled={isVerifying}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors clickable p-2"
              >
                {showPwd ? (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 4.5 12 4.5c4.79 0 8.601 3.549 9.963 7.178.07.186.07.388 0 .574-1.362 3.529-5.174 7.078-9.963 7.078-4.79 0-8.601-3.549-9.963-7.178z"
                    />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`clickable w-full py-6 font-black tracking-[0.8em] uppercase transition-all flex items-center justify-center gap-6 active:scale-[0.98] rounded-sm group overflow-hidden relative ${isSuccess ? "bg-green-500 text-white" : "bg-white text-black hover:bg-zinc-200"}`}
              disabled={isVerifying}
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-[95%] transition-transform duration-500 opacity-5" />
              {isVerifying ? (
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isSuccess ? "border-white" : "border-black"}`}
                  />
                  <span className="opacity-60">
                    {isSuccess ? "DECODED" : "ANALYZING..."}
                  </span>
                </div>
              ) : (
                "UNLOCK_VAULT"
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center opacity-10 text-[8px] tracking-[0.5em] uppercase font-black pt-10 border-t border-white/5">
          <span>BIO_DECODE: ENABLED</span>
          <span>SECURE_NODE_102</span>
        </div>
      </div>

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
