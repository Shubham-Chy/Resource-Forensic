import React, { useEffect, useState } from 'react';
import { Resource, ResourceCategory, CATEGORY_JP } from '../types';

interface ResourceModalProps {
  resource: Resource | null;
  onClose: () => void;
  isDarkMode?: boolean;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose, isDarkMode = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Manage mount/unmount lifecycle for transitions
  useEffect(() => {
    if (resource) {
      setShouldRender(true);
      // Small delay to trigger entry transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      // If resource is null, we handle exit elsewhere, 
      // but this ensures state resets if parent forces close.
      setIsVisible(false);
    }
  }, [resource]);

  const handleCloseTrigger = () => {
    setIsVisible(false);
    // Wait for the longest transition (800ms for backdrop) before unmounting
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 700); 
  };

  if (!resource || !shouldRender) return null;

  const isAnimeClip = resource.category === ResourceCategory.ANIME_CLIPS;

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

          <div className="flex flex-col gap-4 md:gap-5 mt-auto">
            {isAnimeClip ? (
              <div className="grid grid-cols-1 gap-3 md:gap-5">
                <a 
                  id="download-btn"
                  href={resource.driveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`clickable group relative flex items-center justify-center py-4 md:py-5 px-6 md:px-10 font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[11px] overflow-hidden transition-all duration-500 active:scale-[0.98] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                >
                  <span className="relative z-10">ストレージ DRIVE ARCHIVE</span>
                  <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isDarkMode ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                </a>
                <a 
                  id="download-btn"
                  href={resource.getKeyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`clickable group relative flex items-center justify-center border py-4 md:py-5 px-6 md:px-10 font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[11px] overflow-hidden transition-all duration-500 active:scale-[0.98] ${isDarkMode ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                >
                  <span className="relative z-10">アクセスキー GET ACCESS KEY</span>
                  <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
                </a>
              </div>
            ) : (
              <a 
                id="download-btn"
                href={resource.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`clickable group relative flex items-center justify-center py-4 md:py-5 px-6 md:px-10 font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] md:text-[11px] overflow-hidden transition-all duration-500 active:scale-[0.98] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                <span className="relative z-10">ダウンロード DOWNLOAD NOW</span>
                <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isDarkMode ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
              </a>
            )}
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