
import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selected?: Category;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto px-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id as Category)}
          className={`relative group p-8 rounded-xl border transition-all duration-300 text-left overflow-hidden ${
            selected === cat.id 
              ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
              : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-600'
          }`}
        >
          {/* Tactical Corners */}
          <div className={`absolute top-2 left-2 w-2 h-2 border-t border-l ${selected === cat.id ? 'border-blue-500' : 'border-zinc-700'}`}></div>
          <div className={`absolute bottom-2 right-2 w-2 h-2 border-b border-r ${selected === cat.id ? 'border-blue-500' : 'border-zinc-700'}`}></div>

          {/* Background Data Readout (Static visual fluff) */}
          <div className="absolute top-0 right-0 p-2 opacity-5 font-mono text-[8px] leading-tight select-none pointer-events-none">
            SCANNING...<br/>ID:{Math.random().toString(36).substring(7).toUpperCase()}<br/>LVL:00
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className={`${cat.color} w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-inner relative`}>
              <div className="absolute inset-0 bg-white/10 rounded-lg animate-pulse"></div>
              <i className={`${cat.icon} text-white`}></i>
            </div>
            {selected === cat.id && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center animate-in zoom-in">
                <i className="fa-solid fa-check text-white text-sm"></i>
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{cat.name}</h3>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest font-bold">
            Target: {cat.id === 'spotify' ? 'Audio Files' : cat.id === 'gaming' ? 'Combat Records' : 'Visual Logs'}
          </p>
          
          {/* Progress Bar (Visual decoration) */}
          <div className="mt-6 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
             <div className={`h-full transition-all duration-700 ${selected === cat.id ? 'bg-blue-500 w-full' : 'bg-zinc-800 w-0'}`}></div>
          </div>
        </button>
      ))}
    </div>
  );
};
