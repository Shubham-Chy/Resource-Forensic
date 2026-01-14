import React, { useState, useEffect, useRef } from 'react';
import { Resource, ResourceCategory } from './types';
import { getResources } from './data/resources';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import ResourceCard from './components/ResourceCard';
import ResourceModal from './components/ResourceModal';
import SearchOverlay from './components/SearchOverlay';
import ParticleRain from './components/ParticleRain';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SecurityGate from './components/SecurityGate';

type View = 'home' | 'admin_login' | 'admin_panel' | ResourceCategory;

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Ref to track if audio has already been played to ensure it only plays once on entry
  const hasPlayedAudio = useRef(false);

  useEffect(() => {
    try {
      setResources(getResources());
    } catch (e) {
      console.error("Failed to load initial resources:", e);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Forensic Search Shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Global Security: Block dev-tool shortcuts
      if ((e.metaKey || e.ctrlKey) && (e.key === 'u' || e.key === 's')) {
        e.preventDefault();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSelectedResource(null);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const navigateTo = (view: View) => {
    setIsSweeping(true);
    setTimeout(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 500);
    setTimeout(() => setIsSweeping(false), 1000);
  };

  const handleSearchSelect = (resource: Resource) => {
    setSelectedResource(resource);
    setIsSearchOpen(false); 
  };

  const handleLoadingComplete = () => {
    setLoading(false);
    
    // One-time audio trigger on site entry
    if (!hasPlayedAudio.current) {
      const audio = new Audio('/voice_note.mp3');
      audio.volume = 0.35; // Lowered volume to 35%
      audio.play().catch(err => {
        console.debug("Audio playback prevented by browser policy. Interaction required.", err);
      });
      hasPlayedAudio.current = true;
    }
  };

  const isAdminArea = currentView === 'admin_login' || currentView === 'admin_panel';

  if (loading) return <LoadingScreen onComplete={handleLoadingComplete} />;

  const renderContent = () => {
    if (currentView === 'admin_login') {
      return (
        <AdminLogin 
          onBack={() => navigateTo('home')}
          onAuth={() => {
            try {
              sessionStorage.setItem('rf_auth', 'true');
            } catch (e) {}
            navigateTo('admin_panel');
          }} 
        />
      );
    }

    if (currentView === 'admin_panel') {
      return (
        <AdminDashboard onLogout={() => {
          navigateTo('home');
          setTimeout(() => {
            try {
              sessionStorage.removeItem('rf_auth');
            } catch (e) {}
          }, 600);
        }} />
      );
    }

    const CATEGORY_JP: Record<string, string> = {
      'Software': 'ソフトウェア',
      'Plugins': 'プラグイン',
      'Scripts': 'スクリプト',
      'Extensions': '拡張機能',
      'Templates': 'テンプレート',
      'Packs': 'パック',
      'Leaks': 'リーク',
      'Anime Clips': 'アニメクリップ'
    };

    return (
      <>
        <nav id="nav-header" className={`fixed top-0 left-0 right-0 z-[1000] px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:justify-between md:items-center backdrop-blur-xl border-b transition-colors duration-700 ${isDarkMode ? 'bg-black/90 border-white/5' : 'bg-white/95 border-black/5'}`}>
          <div className="flex justify-between items-center w-full md:w-auto">
            <div className="flex items-center gap-5 clickable group" onClick={() => navigateTo('home')}>
              <div className="autography text-3xl md:text-5xl transition-transform group-hover:translate-x-1 text-current whitespace-nowrap text-white">Resource Forensic</div>
            </div>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar md:overflow-visible gap-8 md:gap-12 pb-2 md:pb-0 px-2 md:px-0">
            {Object.values(ResourceCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => navigateTo(cat)}
                className={`clickable nav-link relative text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase transition-all duration-500 whitespace-nowrap active:scale-95 pb-1 ${
                  currentView === cat ? 'font-black opacity-100 active' : 'opacity-30 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
             onClick={() => navigateTo('admin_login')}
             className={`hidden md:block border px-6 py-2 text-[8px] tracking-[0.4em] uppercase font-black transition-all clickable ${isDarkMode ? 'border-white/10 opacity-30 hover:opacity-100' : 'border-black/10 opacity-30 hover:opacity-100'}`}
          >
            ACCESS_TERMINAL
          </button>
        </nav>

        <main className="pt-48 md:pt-64 pb-20 relative z-10">
          {currentView === 'home' ? (
            <HomeView onCategorySelect={navigateTo} onSearchTrigger={() => setIsSearchOpen(true)} isDarkMode={isDarkMode} resources={resources} />
          ) : (
            <CategoryView 
              category={currentView as ResourceCategory} 
              resources={resources.filter(r => r.category === currentView)} 
              onResourceClick={(r) => setSelectedResource(r)}
              isDarkMode={isDarkMode}
              CATEGORY_JP={CATEGORY_JP}
            />
          )}
        </main>

        <div id="theme-switcher" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[2000] flex flex-col items-end gap-2 scale-90 md:scale-100">
           <span className="text-[7px] tracking-[0.3em] uppercase opacity-20 font-black">SCANNER_MODALITY</span>
           <div className={`flex items-center gap-4 border p-1 rounded-sm transition-all duration-700 ${isDarkMode ? 'border-white/10 bg-black/40' : 'border-black/10 bg-white/40'}`}>
              <button 
                onClick={() => setIsDarkMode(false)}
                className={`clickable px-4 py-1 text-[8px] tracking-[0.2em] uppercase transition-all ${!isDarkMode ? 'bg-black text-white font-black' : 'opacity-30 hover:opacity-60 text-white'}`}
              >
                Spectrum
              </button>
              <div className={`w-[1px] h-4 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
              <button 
                onClick={() => setIsDarkMode(true)}
                className={`clickable px-4 py-1 text-[8px] tracking-[0.2em] uppercase transition-all ${isDarkMode ? 'bg-white text-black font-black' : 'opacity-30 hover:opacity-60 text-black'}`}
              >
                Forensic
              </button>
           </div>
        </div>

        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelect={handleSearchSelect} resources={resources} isDarkMode={isDarkMode} />
        <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} isDarkMode={isDarkMode} />
      </>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-700 relative overflow-x-hidden">
      <SecurityGate disabled={isAdminArea} />
      <ParticleRain isDarkMode={isDarkMode} />
      {isSweeping && <div className="forensic-sweep" />}
      {renderContent()}
      <CustomCursor isDarkMode={isAdminArea ? true : isDarkMode} />
    </div>
  );
};

const HomeView: React.FC<{ onCategorySelect: (cat: ResourceCategory) => void, onSearchTrigger: () => void, isDarkMode: boolean, resources: Resource[] }> = ({ onCategorySelect, onSearchTrigger, isDarkMode, resources }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const allCategories = Object.values(ResourceCategory);
  const CATEGORY_JP: Record<string, string> = {
    'Software': 'ソフトウェア',
    'Plugins': 'プラグイン',
    'Scripts': 'スクリプト',
    'Extensions': '拡張機能',
    'Templates': 'テンプレート',
    'Packs': 'パック',
    'Leaks': 'リーク',
    'Anime Clips': 'アニメクリップ'
  };

  useEffect(() => {
    const logPool = [
      "PACK_INGESTED: VFX_ASSETS_V2",
      "SECURITY_SCAN: COMPLETE",
      "ARCHIVE_ACCESS: GRANTED_FOR_UID_82",
      "METADATA_EXTRACTED: CC_SCRIPTS",
      "STORAGE_SYNC: DISTRIBUTING_TO_NODES",
      "ID_VERIFIED: FORENSIC_ADMIN",
      "CACHING_RESOURCES: SOFTWARE_PORTFOLIO"
    ];
    const interval = setInterval(() => {
      setLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], ...prev].slice(0, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="px-4 md:px-8 animate-in fade-in duration-1000 flex flex-col items-center">
      <div id="hero-area" className="mb-24 md:mb-48 text-center px-4">
        <h1 className="hero-title select-none uppercase pointer-events-none mb-2 md:mb-6 leading-[0.7] text-[18vw] md:text-[15vw]">RESOURCE</h1>
        <h1 className="hero-title select-none uppercase pointer-events-none leading-[0.7] text-[18vw] md:text-[15vw]">FORENSIC</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mb-32 md:mb-64">
        <div 
          onClick={onSearchTrigger}
          className={`flex-1 group clickable relative border p-6 md:p-8 flex items-center justify-between transition-all duration-500 hover:scale-[1.01] ${isDarkMode ? 'border-white/10 bg-zinc-950/20' : 'border-black/10 bg-zinc-100/20'}`}
        >
          <div className="flex items-center gap-6 md:gap-10">
            <svg className={`w-5 h-5 md:w-6 md:h-6 opacity-30 group-hover:opacity-100 transition-opacity`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-[10px] md:text-[12px] tracking-[0.5em] md:tracking-[0.8em] uppercase font-black opacity-30 group-hover:opacity-100 transition-opacity">SEARCH THE ARCHIVES...</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[8px] tracking-[0.3em] uppercase opacity-10 font-black hidden md:block">PROTOCOL</span>
            <div className={`hidden md:block w-[1px] h-8 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
            <div className={`border rounded-sm px-3 py-1.5 transition-all ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
               <span className="text-[8px] md:text-[10px] tracking-widest font-black opacity-40">CTRL + K</span>
            </div>
          </div>
        </div>

        <div id="log-feed" className={`w-full md:w-80 h-32 md:h-24 border border-dashed p-4 flex flex-col font-mono overflow-hidden transition-colors ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'}`}>
          <div className="flex items-center gap-2 mb-2 opacity-40">
            <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[7px] font-black tracking-widest uppercase">LIVE_FEED</span>
          </div>
          <div className="space-y-1">
             {logs.slice(0, 3).map((log, i) => (
               <div key={i} className={`text-[6px] tracking-tighter opacity-0 animate-in fade-in slide-in-from-left-2 duration-700 ${i === 0 ? 'text-blue-500' : 'text-current opacity-20'}`}>
                 [{new Date().toLocaleTimeString()}] // {log}
               </div>
             ))}
          </div>
        </div>
      </div>

      <div id="category-grid" className="w-full max-w-7xl mb-64 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-x-4 md:gap-x-8 gap-y-24 md:gap-y-32">
          {allCategories.map((cat) => (
            <div 
              key={cat} 
              onClick={() => onCategorySelect(cat)} 
              className="clickable group flex flex-col items-center gap-6 md:gap-8 w-full transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-24 md:h-32 flex items-end justify-center w-full overflow-hidden">
                <div className="vertical-text text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] opacity-10 group-hover:opacity-100 transition-all font-black uppercase text-center">
                  {CATEGORY_JP[cat]}
                </div>
              </div>
              <div className="relative flex justify-center w-full">
                <div className={`w-[1px] h-8 md:h-12 transition-all duration-700 ${isDarkMode ? 'bg-white/10 group-hover:bg-white group-hover:h-24' : 'bg-black/10 group-hover:bg-black group-hover:h-24'}`} />
                <div className={`absolute top-0 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:top-full transition-all duration-1000 ${isDarkMode ? 'bg-white shadow-[0_0_10px_white]' : 'bg-black shadow-[0_0_10px_black]'}`} />
              </div>
              <span className={`text-[9px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-black transition-all text-center whitespace-nowrap ${isDarkMode ? 'opacity-40 group-hover:opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryView: React.FC<{ category: ResourceCategory, resources: Resource[], onResourceClick: (r: Resource) => void, isDarkMode: boolean, CATEGORY_JP: Record<string, string> }> = ({ category, resources, onResourceClick, isDarkMode, CATEGORY_JP }) => {
  return (
    <div className="px-6 md:px-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className={`mb-16 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 border-b pb-12 md:pb-20 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-10">
          <h2 className="text-4xl md:text-8xl lg:text-[11rem] font-black tracking-tighter uppercase opacity-90 leading-none">{category}</h2>
          <div className="vertical-text text-[10px] md:text-[12px] tracking-[0.8em] md:tracking-[1.2em] opacity-30 uppercase font-black whitespace-nowrap">{CATEGORY_JP[category]}</div>
        </div>
      </div>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-24">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onClick={onResourceClick} isDarkMode={isDarkMode} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 md:py-56 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className={`text-6xl md:text-[14rem] font-black opacity-[0.03] mb-8 select-none transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>近日公開</div>
          <h3 className={`text-4xl md:text-8xl font-black tracking-[0.3em] md:tracking-[0.4em] uppercase opacity-20 mb-8 transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>COMING SOON</h3>
          <p className={`text-[9px] md:text-[11px] tracking-[0.6em] md:tracking-[1em] uppercase opacity-10 font-black transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>DATA TRANSMISSION IN PROGRESS...</p>
        </div>
      )}
    </div>
  );
};

export default App;