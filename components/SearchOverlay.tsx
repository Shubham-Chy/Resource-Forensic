import React, { useEffect, useState, useRef } from 'react';
import { Resource } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resource: Resource) => void;
  resources: Resource[];
  isDarkMode?: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSelect, resources, isDarkMode = true }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = resources.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleResourceClick = (resource: Resource) => {
    onSelect(resource);
    // onClose() is now handled by the parent App component via handleSearchSelect
  };

  return (
    <div id="search-overlay" className={`fixed inset-0 z-[3000] backdrop-blur-md flex flex-col p-6 md:p-20 animate-in fade-in duration-300 ${isDarkMode ? 'bg-black/95 text-white' : 'bg-white/95 text-black'}`}>
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <div className={`flex items-center border-b pb-4 mb-8 ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}>
          <svg className="w-8 h-8 opacity-50 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search archives..." 
            className={`bg-transparent border-none text-4xl md:text-6xl font-bold w-full focus:outline-none placeholder:opacity-10 lowercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="clickable ml-4 opacity-50 hover:opacity-100 p-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scroll">
          {query && filtered.length === 0 && (
            <div className="text-center py-20 opacity-30 text-xl italic font-mono uppercase tracking-widest text-[10px]">NO_FORENSIC_EVIDENCE_FOUND</div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {filtered.map(resource => (
              <div 
                key={resource.id}
                onClick={() => handleResourceClick(resource)}
                className={`clickable group flex items-center justify-between py-6 border-b hover:border-white/20 transition-all cursor-none ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-black">{resource.category}</span>
                  <span className="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:pl-4 transition-all duration-500">{resource.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`mt-8 pt-4 border-t text-[8px] md:text-[10px] tracking-[0.5em] opacity-30 flex justify-between font-black uppercase ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <span>ESC_TO_CLOSE</span>
          <span>ENTER_TO_SELECT</span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;