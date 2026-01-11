import React, { useEffect, useState, useRef } from 'react';
import { Resource, ResourceCategory, CATEGORY_JP, MirrorLink } from '../types';

interface ResourceModalProps {
  resource: Resource | null;
  onClose: () => void;
  isDarkMode?: boolean;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose, isDarkMode = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMirrorMenuOpen, setIsMirrorMenuOpen] = useState(false);
  const [isKeyMenuOpen, setIsKeyMenuOpen] = useState(false);
  
  const mirrorMenuRef = useRef<HTMLDivElement>(null);
  const keyMenuRef = useRef<HTMLDivElement>(null);

  // Manage mount/unmount lifecycle for transitions
  useEffect(() => {
    if (resource) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsMirrorMenuOpen(false);
      setIsKeyMenuOpen(false);
    }
  }, [resource]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mirrorMenuRef.current && !mirrorMenuRef.current.contains(e.target as Node)) {
        setIsMirrorMenuOpen(false);
      }
      if (keyMenuRef.current && !keyMenuRef.current.contains(e.target as Node)) {
        setIsKeyMenuOpen(false);
      }
    };
    if (isMirrorMenuOpen || isKeyMenuOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isMirrorMenuOpen, isKeyMenuOpen]);

  const handleCloseTrigger = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 700); 
  };

  const handleDriveAction = (e: React.MouseEvent) => {
    const mirrors = resource?.driveLinks || [];
    if (mirrors.length > 1) {
      e.preventDefault();
      setIsMirrorMenuOpen(!isMirrorMenuOpen);
      setIsKeyMenuOpen(false);
    }
  };

  const handleKeyAction = (e: React.MouseEvent) => {
    const keys = resource?.keyLinks || [];
    if (keys.length > 1) {
      e.preventDefault();
      setIsKeyMenuOpen(!isKeyMenuOpen);
      setIsMirrorMenuOpen(false);
    }
  };

  if (!resource || !shouldRender) return null;

  const isAnimeClip = resource.category === ResourceCategory.ANIME_CLIPS;
  
  const driveMirrors = resource.driveLinks || (resource.driveUrl ? [{ label: 'GOOGLE DRIVE', url: resource.driveUrl }] : []);
  const hasMultipleMirrors = driveMirrors.length > 1;

  const keyMirrors = resource.keyLinks || (resource.getKeyUrl ? [{ label: 'ACCESS KEY', url: resource.getKeyUrl }] : []);
  const hasMultipleKeys = keyMirrors.length > 1;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-0 md:p-8">
      {/* Dynamic Backdrop with Incremental Blur */}
      <div 
        className={`absolute inset-0 bg-black/60 transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? 'backdrop-blur-[40px] opacity-100' : 'backdrop-blur-none opacity-0'}`}
        onClick={handleCloseTrigger}
      />
      
      {/* Kinetic Modal Container */}
      <div 
        className={`relative border w-full max-w-6xl h-full md:h-[85vh] flex flex-col md:flex-row overflow-hidden md:rounded-sm shadow-[0_0_120px_rgba(0,0,0,1)] transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-32 scale-[0.95]'
        } ${isDarkMode ? 'bg-[#050505] border-white/10 text-white' : 'bg-[#fafafa] border-black/10 text-black'}`}
      >
        
        {/* Close Interaction */}
        <button 
          onClick={handleCloseTrigger}
          className={`absolute top-4 right-4 md:top-8 md:right-8 z-50 transition-all clickable p-2 md:p-3 border rounded-full ${isDarkMode ? 'text-white/40 hover:text-white bg-black/50 border-white/5' : 'text-black/40 hover:text-black bg-white/50 border-black/5'}`}
        >
          <svg width="20" height="20" className="md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media Forensic Engine */}
        <div className={`w-full md:w-[60%] lg:w-[65%] bg-black relative flex items-center justify-center border-b md:border-b-0 md:border-r overflow-hidden ${isDarkMode ? 'border-white/5' : 'border-black/5'} min-h-[40vh] md:min-h-0`}>
          <div className={`w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'scale-100 opacity-100 blur-0' : 'scale-110 opacity-0 blur-md'}`}>
            {resource.youtubeId ? (
              <div className="w-full h-full aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${resource.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                  title={resource.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img 
                src={resource.thumbnail} 
                alt={resource.name} 
                className={`w-full h-full object-cover transition-all duration-1000 scale-100 hover:scale-105 ${isDarkMode ? 'grayscale hover:grayscale-0' : ''}`}
              />
            )}
          </div>
          <div className={`absolute top-6 left-6 md:top-10 md:left-10 vertical-text text-[8px] md:text-[10px] tracking-[1.2em] md:tracking-[1.8em] select-none pointer-events-none uppercase transition-all duration-1000 delay-500 ${isVisible ? 'opacity-20 translate-x-0' : 'opacity-0 -translate-x-4'} ${isDarkMode ? 'text-white' : 'text-black'}`}>
            鑑識報告書 // ENTRY DATA REPORT
          </div>
        </div>

        {/* Forensic Metadata Panel */}
        <div className={`w-full md:w-[40%] lg:w-[35%] p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-y-auto no-scrollbar transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} ${isDarkMode ? 'bg-gradient-to-br from-zinc-950 to-black' : 'bg-gradient-to-br from-zinc-100 to-white'}`}>
          <div className="mb-12 md:mb-0">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
               <div className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] ${isDarkMode ? 'text-white' : 'text-black'}`}>{resource.category}</div>
               <div className={`text-[8px] md:text-[10px] font-light hidden md:block ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>{CATEGORY_JP[resource.category]}</div>
               <div className={`h-[1px] flex-1 transition-all duration-1000 ${isVisible ? 'w-full opacity-10' : 'w-0 opacity-0'} ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
            </div>
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-10 tracking-tighter leading-none uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {resource.name}
            </h2>
            <p className={`text-xs md:text-sm lg:text-base leading-relaxed mb-8 md:mb-16 font-medium tracking-tight ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
              {resource.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 mt-auto relative">
            <div className="grid grid-cols-1 gap-3 md:gap-5">
              {/* Drive Mirrors Button */}
              {(driveMirrors.length > 0) && (
                <div className="relative" ref={mirrorMenuRef}>
                  <a 
                    href={hasMultipleMirrors ? undefined : driveMirrors[0]?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={handleDriveAction}
                    className={`clickable group relative flex items-center justify-center py-4 md:py-5 px-6 md:px-10 font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[11px] overflow-hidden transition-all duration-500 active:scale-[0.98] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >
                    <span className="relative z-10 flex items-center gap-3 uppercase">
                      ストレージ DRIVE ARCHIVE
                      {hasMultipleMirrors && (
                        <svg className={`w-3 h-3 transition-transform duration-300 ${isMirrorMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7"/></svg>
                      )}
                    </span>
                    <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isDarkMode ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                  </a>

                  {isMirrorMenuOpen && (
                    <div className={`absolute bottom-full left-0 w-full mb-2 border p-1 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 z-50 ${isDarkMode ? 'bg-zinc-950 border-white/20' : 'bg-white border-black/20'}`}>
                      <div className="text-[7px] tracking-[0.4em] uppercase font-black opacity-20 p-3 border-b border-white/5">Select_Cloud_Mirror</div>
                      {driveMirrors.map((m, idx) => (
                        <a 
                          key={idx}
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMirrorMenuOpen(false)}
                          className={`clickable block w-full text-left p-4 text-[9px] tracking-[0.3em] font-black uppercase transition-all ${isDarkMode ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'}`}
                        >
                          // {m.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Key Protocols Button */}
              {(keyMirrors.length > 0) && (
                <div className="relative" ref={keyMenuRef}>
                  <a 
                    href={hasMultipleKeys ? undefined : keyMirrors[0]?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={handleKeyAction}
                    className={`clickable group relative flex items-center justify-center border py-4 md:py-5 px-6 md:px-10 font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[11px] overflow-hidden transition-all duration-500 active:scale-[0.98] ${isDarkMode ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                  >
                    <span className="relative z-10 flex items-center gap-3 uppercase">
                      アクセスキー GET ACCESS KEY
                      {hasMultipleKeys && (
                        <svg className={`w-3 h-3 transition-transform duration-300 ${isKeyMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7"/></svg>
                      )}
                    </span>
                    <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
                  </a>

                  {isKeyMenuOpen && (
                    <div className={`absolute bottom-full left-0 w-full mb-2 border p-1 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 z-50 ${isDarkMode ? 'bg-zinc-950 border-white/20' : 'bg-white border-black/20'}`}>
                      <div className="text-[7px] tracking-[0.4em] uppercase font-black opacity-20 p-3 border-b border-white/5">Select_Key_Protocol</div>
                      {keyMirrors.map((m, idx) => (
                        <a 
                          key={idx}
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsKeyMenuOpen(false)}
                          className={`clickable block w-full text-left p-4 text-[9px] tracking-[0.3em] font-black uppercase transition-all ${isDarkMode ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'}`}
                        >
                          // {m.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Download Button (Only if specifically Software/Pack and not showing mirrors) */}
              {!isAnimeClip && resource.downloadUrl && (
                <a 
                  href={resource.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`clickable group relative flex items-center justify-center py-4 md:py-5 px-6 md:px-10 font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[11px] overflow-hidden transition-all duration-500 active:scale-[0.98] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                >
                  <span className="relative z-10 uppercase">ダウンロード DOWNLOAD NOW</span>
                  <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isDarkMode ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                </a>
              )}
            </div>

            <div className={`text-[7px] md:text-[9px] text-center opacity-10 tracking-[0.6em] md:tracking-[1em] mt-6 md:mt-10 uppercase font-black transition-opacity duration-1000 delay-1000 ${isVisible ? 'opacity-10' : 'opacity-0'}`}>
              VAULT_ID: {resource.id.toUpperCase()} // 承認済み
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;