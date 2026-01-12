import React, { useEffect, useRef, useState } from 'react';

const AudioOperator: React.FC<{ startAudio: boolean }> = ({ startAudio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visualizerBars] = useState(new Array(12).fill(0));

  useEffect(() => {
    // Note: User can replace this path with their actual voice note URL
    audioRef.current = new Audio('/voice_note.mp3');
    audioRef.current.loop = false;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (startAudio && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.debug("Audio handshake failed:", err));
    }
  }, [startAudio]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[2000] flex flex-col items-start gap-3 pointer-events-auto">
      <div className="flex items-center gap-4 border border-white/5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-sm group">
        {/* Status Indicator */}
        <div className="flex flex-col gap-0.5">
           <div className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-600'}`} />
              <span className="text-[7px] tracking-[0.3em] font-black uppercase opacity-40">VOICE_FEED: {isPlaying ? 'ACTIVE' : 'IDLE'}</span>
           </div>
           <span className="text-[6px] tracking-[0.1em] opacity-10 font-black uppercase">PROTOCOL_HANDSHAKE_02</span>
        </div>

        {/* Visualizer */}
        <div className="flex items-end gap-[2px] h-4 w-12 px-2 border-l border-white/10">
          {visualizerBars.map((_, i) => (
            <div 
              key={i} 
              className={`w-[2px] bg-white transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-[2px] opacity-10'}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '2px',
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + Math.random()}s`
              }} 
            />
          ))}
        </div>

        {/* Control Button */}
        <button 
          onClick={togglePlayback}
          className="clickable ml-2 p-2 hover:bg-white/5 rounded-sm transition-colors"
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-30 transition-opacity">
        <span className="text-[6px] tracking-widest font-black uppercase">DATA_TRANSMISSION // DECODING</span>
      </div>
    </div>
  );
};

export default AudioOperator;