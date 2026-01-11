
import React from 'react';
import { RoastResult } from '../types';

interface RoastCardProps {
  result: RoastResult;
  onReset: () => void;
}

export const RoastCard: React.FC<RoastCardProps> = ({ result, onReset }) => {
  const getHeatColor = (level: number) => {
    if (level < 4) return 'text-yellow-400';
    if (level < 8) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="relative group max-w-2xl w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className={`absolute -inset-1 bg-gradient-to-r ${result.cookingLevel > 7 ? 'from-red-600 to-orange-600' : 'from-zinc-600 to-zinc-400'} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
      <div className="relative px-8 py-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center text-center">
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-5xl font-black ${getHeatColor(result.cookingLevel)}`}>
            {result.cookingLevel}/10
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Heat Level</span>
            <span className={`text-xl font-bold uppercase ${getHeatColor(result.cookingLevel)}`}>
              {result.verdict}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800 my-6"></div>

        <p className="text-xl md:text-2xl font-medium text-zinc-100 italic leading-relaxed">
          "{result.roast}"
        </p>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={onReset}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
          >
            <i className="fa-solid fa-rotate-left"></i>
            Run it back
          </button>
          <button 
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all"
            onClick={() => {
                navigator.clipboard.writeText(`I got cooked by an AI: "${result.roast}" - Verdict: ${result.verdict} (Heat: ${result.cookingLevel}/10). Get roasted at Cooked.ai`);
                alert('Copied your shame to clipboard.');
            }}
          >
            <i className="fa-solid fa-share-nodes"></i>
            Share the pain
          </button>
        </div>
      </div>
    </div>
  );
};
