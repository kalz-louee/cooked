
import React, { useState } from 'react';
import { RoastResult } from '../types';

interface RoastCardProps {
  result: RoastResult;
  onReset: () => void;
  onOpenShare: () => void;
}

export const RoastCard: React.FC<RoastCardProps> = ({ result, onReset, onOpenShare }) => {
  const [activeTab, setActiveTab] = useState<'bad' | 'good'>('bad');

  return (
    <div className="relative group max-w-2xl w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Background glow effects */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${activeTab === 'bad' ? 'from-orange-600/30 to-red-600/30' : 'from-blue-600/30 to-indigo-600/30'} rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700`}></div>
      
      <div className="relative bg-zinc-950/90 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] tactical-border">
        
        {/* TERMINAL HEADER */}
        <div className="flex h-16 bg-zinc-900/50 border-b border-zinc-800 items-center px-6">
          <div className="flex gap-1.5 mr-6">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex bg-black/40 rounded-lg p-1 border border-zinc-800/50">
              <button 
                onClick={() => setActiveTab('bad')}
                className={`px-6 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bad' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                BAD_COP
              </button>
              <button 
                onClick={() => setActiveTab('good')}
                className={`px-6 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'good' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                GOOD_COP
              </button>
            </div>
          </div>
          <div className="font-mono text-[9px] text-zinc-600 font-bold uppercase tracking-widest hidden md:block">
            Report_ID: {Math.floor(Math.random() * 10000)}
          </div>
        </div>

        {/* TERMINAL CONTENT */}
        <div className="p-10 md:p-14 min-h-[400px] flex flex-col justify-center text-center relative">
          
          {/* BAD COP VIEW */}
          {activeTab === 'bad' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="inline-block mb-8 relative">
                 <div className="text-7xl font-black text-orange-600 italic tracking-tighter leading-none mb-1">
                   {result.cookingLevel}<span className="text-2xl">/10</span>
                 </div>
                 <div className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-[0.4em] absolute -bottom-4 left-0 w-full text-center">
                   Criminal Heat
                 </div>
              </div>
              
              <h3 className="text-4xl font-black mb-8 uppercase text-white tracking-tighter italic border-y border-orange-600/20 py-4">
                {result.verdict}
              </h3>
              
              <div className="relative p-6 bg-orange-600/5 border border-orange-600/20 rounded-xl">
                <i className="fa-solid fa-quote-left absolute top-4 left-4 opacity-10 text-4xl"></i>
                <p className="text-xl md:text-2xl font-medium text-zinc-100 italic leading-relaxed">
                  "{result.roast}"
                </p>
                <i className="fa-solid fa-quote-right absolute bottom-4 right-4 opacity-10 text-4xl"></i>
              </div>
            </div>
          )}

          {/* GOOD COP VIEW */}
          {activeTab === 'good' && (
            <div className="animate-in fade-in slide-in-from-right-10 duration-500 text-left">
              <div className="flex items-center gap-4 mb-10 border-b border-blue-600/20 pb-6">
                 <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center text-3xl text-blue-500">
                   <i className="fa-solid fa-shield-halved"></i>
                 </div>
                 <div>
                   <h3 className="text-2xl font-black uppercase text-white leading-none mb-1">Protocol: Redemption</h3>
                   <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">Authorized Rehabilitation Plan</span>
                 </div>
              </div>

              <div className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-4 items-center bg-blue-600/5 p-4 rounded-xl border border-blue-600/20 group hover:border-blue-500 transition-all">
                    <div className="font-mono text-xl font-black text-blue-500 opacity-50">0{i + 1}</div>
                    <p className="text-zinc-300 text-sm font-medium leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACTION FOOTER */}
        <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex flex-wrap justify-between items-center gap-4">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-power-off text-red-500"></i>
            Purge_Data
          </button>
          
          <div className="flex gap-3">
            <button 
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-[10px] font-black tracking-widest transition-all"
              onClick={onOpenShare}
            >
              <i className="fa-brands fa-instagram text-orange-500"></i>
              STORY_LAB
            </button>

            <button 
              className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-[10px] font-black tracking-widest transition-all ${activeTab === 'bad' ? 'bg-orange-600 shadow-lg shadow-orange-600/20' : 'bg-blue-600 shadow-lg shadow-blue-600/20'}`}
              onClick={() => {
                  const text = activeTab === 'bad' ? `ROASTED: "${result.roast}"` : `REDEMPTION: ${result.recommendations[0]}`;
                  navigator.clipboard.writeText(`${text} | GoodCopBadCop.ai`);
                  alert('DATA_COPIED_TO_CLIPBOARD');
              }}
            >
              <i className="fa-solid fa-fingerprint"></i>
              COPY_REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
