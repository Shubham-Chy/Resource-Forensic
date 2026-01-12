import React from 'react';
import { Resource, CATEGORY_JP } from '../types';

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
  isDarkMode?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick, isDarkMode = true }) => {
  return (
    <div 
      id="resource-card"
      onClick={() => onClick(resource)}
      className={`clickable relative group w-full max-w-[560px] aspect-[16/9] flex flex-col overflow-hidden rounded-sm cursor-none transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1) hover:scale-[1.03] shadow-2xl border ${isDarkMode ? 'border-white/5 bg-zinc-950 shadow-black/80' : 'border-black/5 bg-zinc-100 shadow-black/10'}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={resource.thumbnail} 
          alt={resource.name}
          className={`w-full h-full object-cover grayscale transition-all duration-1000 ${resource.isUpcoming ? 'brightness-[0.2] blur-[4px]' : 'brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110'}`}
        />
        <div className={`absolute inset-0 opacity-70 group-hover:opacity-30 transition-opacity duration-700 ${isDarkMode ? 'bg-black' : 'bg-zinc-900'}`} />
      </div>

      <div className={`absolute top-6 right-8 vertical-text opacity-10 group-hover:opacity-60 transition-opacity duration-700 text-[9px] tracking-[1.2em] uppercase font-black text-white pointer-events-none`}>
        {CATEGORY_JP[resource.category]} // 鑑識
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center">
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <span className="text-[10px] tracking-[0.6em] uppercase opacity-40 font-black text-white group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {resource.category}
          </span>
          <div className={`h-[1px] bg-white/40 transition-all duration-1000 ${resource.isUpcoming ? 'w-24 opacity-20' : 'w-8 group-hover:w-32 group-hover:opacity-80'}`} />
          
          {resource.isUpcoming && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none w-full">
               <span className="text-[40px] md:text-[50px] font-black opacity-[0.05] group-hover:opacity-[0.15] transition-opacity uppercase tracking-tighter mb-[-25px]">UPCOMING</span>
               <div className="flex flex-col items-center gap-2 mt-8">
                  <span className="text-[9px] font-black tracking-[0.6em] text-blue-400 opacity-60 uppercase mb-1">近日公開</span>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
               </div>
            </div>
          )}

          <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight uppercase text-white break-words w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-500 ${resource.isUpcoming ? 'opacity-30 group-hover:opacity-60' : 'group-hover:scale-[1.02]'}`}>
            {resource.name}
          </h3>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
         <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] tracking-[0.8em] uppercase font-black text-white whitespace-nowrap">
              {resource.isUpcoming ? '情報 // INTEL' : '閲覧 // INSPECT ENTRY'}
            </span>
            <div className="w-4 h-[1px] bg-white/40 group-hover:w-16 transition-all duration-700" />
         </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
    </div>
  );
};

export default ResourceCard;