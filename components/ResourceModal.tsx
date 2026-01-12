import React, { useEffect, useState, useRef } from 'react';
import { Resource, ResourceCategory, CATEGORY_JP, MirrorLink, Season, Episode } from '../types';

interface ResourceModalProps {
  resource: Resource | null;
  onClose: () => void;
  isDarkMode?: boolean;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose, isDarkMode = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Anime Navigation State
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  // Link Menu States
  const [isMirrorMenuOpen, setIsMirrorMenuOpen] = useState(false);
  const [isKeyMenuOpen, setIsKeyMenuOpen] = useState(false);
  
  const mirrorMenuRef = useRef<HTMLDivElement>(null);
  const keyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resource) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      
      // Initializing Anime Navigation
      if (resource.category === ResourceCategory.ANIME_CLIPS && resource.isSeasonBased && resource.seasons?.length) {
        setActiveSeason(resource.seasons[0]);
        setActiveEpisode(null);
      } else {
        setActiveSeason(null);
        setActiveEpisode(null);
      }

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsMirrorMenuOpen(false);
      setIsKeyMenuOpen(false);
    }
  }, [resource]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mirrorMenuRef.current && !mirrorMenuRef.current.contains(e.target as Node)) setIsMirrorMenuOpen(false);
      if (keyMenuRef.current && !keyMenuRef.current.contains(e.target as Node)) setIsKeyMenuOpen(false);
    };
    if (isMirrorMenuOpen || isKeyMenuOpen) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isMirrorMenuOpen, isKeyMenuOpen]);

  const handleCloseTrigger = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 700); 
  };

  if (!resource || !shouldRender) return null;

  const isSeasonAnime = resource.category === ResourceCategory.ANIME_CLIPS && resource.isSeasonBased;

  // Link Calculation logic
  let currentDriveLinks: MirrorLink[] = [];
  let currentKeyLinks: MirrorLink[] = [];
  let currentDownloadUrl: string | undefined = resource.downloadUrl;

  if (isSeasonAnime && activeEpisode) {
    currentDriveLinks = activeEpisode.driveLinks;
    currentKeyLinks = activeEpisode.keyLinks;
    currentDownloadUrl = undefined; // We don't use main download for seasonal episodes
  } else if (!isSeasonAnime) {
    currentDriveLinks = resource.driveLinks || (resource.driveUrl ? [{ label: 'GOOGLE DRIVE', url: resource.driveUrl }] : []);
    currentKeyLinks = resource.keyLinks || (resource.getKeyUrl ? [{ label: 'ACCESS KEY', url: resource.getKeyUrl }] : []);
  }

  const hasMultipleMirrors = currentDriveLinks.length > 1;
  const hasMultipleKeys = currentKeyLinks.length > 1;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-0 md:p-8">
      <div className={`absolute inset-0 bg-black/60 transition-all duration-[800ms] ${isVisible ? 'backdrop-blur-[40px] opacity-100' : 'backdrop-blur-none opacity-0'}`} onClick={handleCloseTrigger} />
      
      <div className={`relative border w-full max-w-7xl h-full md:h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] transition-all duration-[700ms] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-[0.95]'} ${isDarkMode ? 'bg-[#050505] border-white/10 text-white' : 'bg-[#fafafa] border-black/10 text-black'}`}>
        
        <button onClick={handleCloseTrigger} className={`absolute top-4 right-4 z-50 transition-all p-2 border rounded-full ${isDarkMode ? 'text-white/40 hover:text-white bg-black/50 border-white/5' : 'text-black/40 hover:text-black bg-white/50 border-black/5'}`}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className={`w-full md:w-[55%] bg-black relative flex items-center justify-center border-b md:border-b-0 md:border-r overflow-hidden ${isDarkMode ? 'border-white/5' : 'border-black/5'} min-h-[40vh] md:min-h-0`}>
          <div className={`w-full h-full transition-all duration-[1200ms] ${isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
            {resource.youtubeId && !resource.isUpcoming ? (
              <iframe className="w-full h-full aspect-video" src={`https://www.youtube.com/embed/${resource.youtubeId}?autoplay=1&mute=0&rel=0`} frameBorder="0" allowFullScreen />
            ) : (
              <img src={resource.thumbnail} className={`w-full h-full object-cover transition-all ${resource.isUpcoming ? 'grayscale brightness-[0.2]' : ''}`} />
            )}
          </div>
          <div className="absolute top-6 left-6 vertical-text text-[8px] tracking-[1.8em] uppercase opacity-20">ENTRY DATA REPORT // 鑑識</div>
        </div>

        <div className={`w-full md:w-[45%] p-8 md:p-14 flex flex-col overflow-y-auto no-scrollbar ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
               <span className="text-[10px] font-black uppercase tracking-[0.6em]">{resource.category}</span>
               {resource.isUpcoming && <span className="text-[8px] font-black tracking-[0.4em] bg-blue-500/10 text-blue-400 px-3 py-1 border border-blue-500/20">UPCOMING</span>}
               <div className="h-[1px] flex-1 bg-white/10" />
            </div>
            <h2 className={`text-3xl md:text-5xl font-black mb-6 tracking-tighter leading-none uppercase ${resource.isUpcoming ? 'opacity-40' : ''}`}>{resource.name}</h2>
            <p className="text-xs md:text-sm leading-relaxed opacity-40 mb-10">{resource.description}</p>

            {/* Anime Seasons/Episodes Navigator */}
            {isSeasonAnime && !resource.isUpcoming && (
              <div className="space-y-10 animate-in fade-in duration-1000">
                <div className="space-y-4">
                  <span className="text-[8px] font-black tracking-[0.4em] opacity-20 uppercase">SELECT_PROTOCOL // SEASON</span>
                  <div className="flex flex-wrap gap-2">
                    {resource.seasons?.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => { setActiveSeason(s); setActiveEpisode(null); }}
                        className={`px-4 py-2 text-[9px] font-black tracking-widest border transition-all ${activeSeason?.id === s.id ? 'bg-white text-black border-white' : 'border-white/10 opacity-30 hover:opacity-100'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeSeason && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <span className="text-[8px] font-black tracking-[0.4em] opacity-20 uppercase">SEGMENT_INDEX // EPISODE</span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {activeSeason.episodes.map(e => (
                        <button 
                          key={e.id}
                          onClick={() => { setActiveEpisode(e); setIsMirrorMenuOpen(false); setIsKeyMenuOpen(false); }}
                          className={`aspect-square flex items-center justify-center text-[10px] font-black border transition-all ${activeEpisode?.id === e.id ? 'bg-white text-black border-white' : 'border-white/5 opacity-20 hover:opacity-100'}`}
                        >
                          {String(e.number).padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto space-y-4 relative">
            {/* Conditional Action Buttons */}
            {resource.isUpcoming ? (
              <div className="py-16 md:py-24 border border-dashed border-white/10 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-1000">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
                    <span className="text-[11px] font-black tracking-[0.8em] text-blue-400 uppercase">TRANSMISSION_PENDING</span>
                 </div>
                 <div className="max-w-xs text-center">
                    <p className="text-[9px] opacity-20 font-black tracking-[0.3em] uppercase leading-loose">ENCRYPTED DATA PACKETS ARE STILL IN TRANSIT. ACCESS GATEWAY WILL OPEN UPON VERIFICATION.</p>
                 </div>
                 <span className="text-[8px] opacity-[0.05] font-black tracking-[1.2em] uppercase pt-4">近日公開 // COMING SOON</span>
              </div>
            ) : (!isSeasonAnime || activeEpisode) ? (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Drive Mirror Logic */}
                {(currentDriveLinks.length > 0) && (
                  <div className="relative" ref={mirrorMenuRef}>
                    <a 
                      href={hasMultipleMirrors ? undefined : currentDriveLinks[0]?.url} 
                      target="_blank" 
                      onClick={(e) => hasMultipleMirrors && (e.preventDefault(), setIsMirrorMenuOpen(!isMirrorMenuOpen))}
                      className={`clickable group w-full py-5 px-10 flex items-center justify-center font-black tracking-[0.5em] text-[10px] transition-all ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                      ストレージ DRIVE ARCHIVE
                      {hasMultipleMirrors && <svg className={`w-3 h-3 ml-3 transition-transform ${isMirrorMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7"/></svg>}
                    </a>
                    {isMirrorMenuOpen && (
                      <div className="absolute bottom-full left-0 w-full mb-2 bg-[#0a0a0a] border border-white/20 p-1 z-50">
                        {currentDriveLinks.map((m, idx) => (
                          <a key={idx} href={m.url} target="_blank" className="block p-4 text-[9px] font-black tracking-widest hover:bg-white hover:text-black uppercase">// {m.label}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Key Protocol Logic */}
                {(currentKeyLinks.length > 0) && (
                  <div className="relative" ref={keyMenuRef}>
                    <a 
                      href={hasMultipleKeys ? undefined : currentKeyLinks[0]?.url} 
                      target="_blank" 
                      onClick={(e) => hasMultipleKeys && (e.preventDefault(), setIsKeyMenuOpen(!isKeyMenuOpen))}
                      className="clickable group w-full py-5 px-10 border border-white/10 flex items-center justify-center font-black tracking-[0.5em] text-[10px] transition-all hover:bg-white/5"
                    >
                      アクセスキー GET ACCESS KEY
                      {hasMultipleKeys && <svg className={`w-3 h-3 ml-3 transition-transform ${isKeyMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7"/></svg>}
                    </a>
                    {isKeyMenuOpen && (
                      <div className="absolute bottom-full left-0 w-full mb-2 bg-[#0a0a0a] border border-white/20 p-1 z-50">
                        {currentKeyLinks.map((m, idx) => (
                          <a key={idx} href={m.url} target="_blank" className="block p-4 text-[9px] font-black tracking-widest hover:bg-white hover:text-black uppercase">// {m.label}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Standalone Download */}
                {currentDownloadUrl && (
                  <a href={currentDownloadUrl} target="_blank" className={`clickable w-full py-5 flex items-center justify-center font-black tracking-[0.5em] text-[10px] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>DOWNLOAD NOW</a>
                )}
              </div>
            ) : isSeasonAnime && (
              <div className="py-12 border border-dashed border-white/5 flex flex-col items-center justify-center opacity-20">
                <span className="text-[9px] font-black tracking-[0.5em] uppercase">SELECT_SEGMENT_TO_DECODE</span>
              </div>
            )}
            
            <div className="text-[8px] text-center opacity-10 tracking-[1em] mt-8 uppercase font-black">VAULT_ID: {resource.id.toUpperCase()} // 承認済み</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;