
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { RoastResult, Category } from '../types';
import { Button } from './Button';

interface ShareModalProps {
  result: RoastResult;
  category: Category;
  inputSummary: string;
  onClose: () => void;
}

type StyleOption = 'noir' | 'neon' | 'classic';

export const ShareModal: React.FC<ShareModalProps> = ({ result, category, inputSummary, onClose }) => {
  const [activeStyle, setActiveStyle] = useState<StyleOption>('classic');
  const [generating, setGenerating] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setGenerating(true);
    
    // Minimal delay to ensure browser has painted current state
    await new Promise(r => setTimeout(r, 100));

    try {
      // html2canvas works best with fixed-pixel containers and absolute children
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: activeStyle === 'noir' ? '#f4f4f2' : '#05070a',
        scale: 3, // 3x scale is enough for high quality while keeping file size reasonable
        useCORS: true,
        logging: false,
        width: 320,
        height: 568,
        onclone: (clonedDoc) => {
          // Ensure the cloned element is perfectly visible for the capture engine
          const el = clonedDoc.getElementById('capture-target');
          if (el) {
            el.style.transform = 'none';
            el.style.left = '0';
            el.style.top = '0';
            el.style.position = 'relative';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `GPBC-CASE-REPORT-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('System capture failed. Try switching to "Classic" style.');
    } finally {
      setGenerating(false);
    }
  };

  const getStyleClasses = () => {
    switch (activeStyle) {
      case 'noir':
        return 'bg-[#f4f4f2] text-[#1a1a1a] font-serif border-[12px] border-[#1a1a1a]';
      case 'neon':
        return 'bg-[#000000] text-white border-2 border-[#f97316]';
      default:
        return 'bg-[#05070a] text-white border border-zinc-800';
    }
  };

  const getBackgroundOverlay = () => {
    if (activeStyle === 'noir') {
      return (
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#000 1px, transparent 0)', 
               backgroundSize: '12px 12px',
               zIndex: 1
             }}>
        </div>
      );
    }
    if (activeStyle === 'neon') {
       return (
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(transparent 50%, rgba(249,115,22,0.3) 50%)', 
               backgroundSize: '100% 4px',
               zIndex: 1
             }}>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 items-start justify-center py-10">
        
        {/* PREVIEW PANEL */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">LIVE_PREVIEW_9:16</h3>
          </div>
          
          {/* THE CAPTURE TARGET - ABSOLUTELY NO FLEX OR GAP INSIDE THIS BOX */}
          <div 
            id="capture-target"
            ref={captureRef}
            className={`w-[320px] h-[568px] overflow-hidden relative ${getStyleClasses()}`}
            style={{ boxSizing: 'border-box', display: 'block' }}
          >
            {getBackgroundOverlay()}
            
            {/* 1. Header Block */}
            <div className="absolute top-[40px] left-0 w-full text-center z-10 px-6">
              <div className={`text-[8px] font-mono font-bold uppercase tracking-[0.4em] mb-3 ${activeStyle === 'noir' ? 'text-black opacity-60' : 'text-zinc-500'}`}>
                INTEL_LOG_{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <h2 className={`text-4xl font-black leading-[0.9] tracking-tighter mb-2 ${
                activeStyle === 'noir' ? 'text-black' : 
                activeStyle === 'neon' ? 'text-[#f97316]' : 
                'text-blue-500'
              }`}>
                GUILTY AS <br/>CHARGED.
              </h2>
              <div className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${activeStyle === 'noir' ? 'text-black opacity-80' : 'text-zinc-400'}`}>
                 TARGET: {inputSummary.length > 20 ? inputSummary.substring(0, 17) + '...' : inputSummary}
              </div>
            </div>

            {/* 2. Score Block */}
            <div className="absolute top-[175px] left-0 w-full text-center z-10">
              <div className={`text-8xl font-black italic tracking-tighter leading-none ${
                activeStyle === 'noir' ? 'text-black' : 
                activeStyle === 'neon' ? 'text-[#f97316]' : 
                'text-blue-500'
              }`}>
                {result.cookingLevel}<span className="text-2xl not-italic">/10</span>
              </div>
              <div className={`text-[8px] font-mono font-black uppercase tracking-[0.5em] mt-1 ${activeStyle === 'noir' ? 'text-black opacity-50' : 'text-zinc-500'}`}>
                 HEAT_INDEX
              </div>
            </div>

            {/* 3. Verdict Block */}
            <div className="absolute top-[290px] left-0 w-full text-center z-10">
               <div className={`text-[10px] font-black uppercase tracking-widest inline-block px-4 py-1.5 ${
                 activeStyle === 'noir' ? 'bg-black text-white' : 
                 activeStyle === 'neon' ? 'bg-[#f97316] text-white' : 
                 'bg-zinc-900 border border-zinc-800 text-zinc-400'
               }`}>
                VERDICT: {result.verdict}
              </div>
            </div>

            {/* 4. Recommendations Block */}
            <div className={`absolute top-[350px] left-[32px] right-[32px] z-10 pt-6 border-t ${activeStyle === 'noir' ? 'border-black/20' : 'border-zinc-800/40'}`}>
              <div className={`text-[8px] font-mono font-bold uppercase tracking-widest mb-4 ${
                activeStyle === 'noir' ? 'text-black opacity-80' : 
                activeStyle === 'neon' ? 'text-[#f97316]' : 
                'text-blue-500'
              }`}>
                REHAB_PROTOCOL
              </div>
              <div className="block">
                {result.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="block mb-3">
                    <div className="inline-flex gap-2 items-start">
                      <span className={`text-[9px] font-black ${
                        activeStyle === 'noir' ? 'text-black' : 
                        activeStyle === 'neon' ? 'text-[#f97316]' : 
                        'text-blue-600'
                      }`}>{i+1}.</span>
                      <div className={`text-[9px] font-medium leading-tight ${
                        activeStyle === 'noir' ? 'text-black/80' : 
                        activeStyle === 'neon' ? 'text-zinc-200' : 
                        'text-zinc-300'
                      }`}>
                        {rec.split(' with ')[0].split(':')[0].substring(0, 50)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Footer Block */}
            <div className="absolute bottom-[40px] left-0 w-full text-center z-10">
              <div className="inline-block mb-2">
                 <div className="flex items-center border border-current rounded-sm">
                   <div className={`px-1.5 py-0.5 text-[8px] font-black ${activeStyle === 'noir' ? 'bg-black text-white' : 'bg-blue-600 text-white'}`}>GOOD</div>
                   <div className={`px-1.5 py-0.5 text-[8px] font-black ${activeStyle === 'noir' ? 'bg-white text-black border-l border-black' : 'bg-[#f97316] text-white'}`}>BAD</div>
                 </div>
              </div>
              <div className={`text-[6px] font-mono font-bold tracking-[0.3em] ${activeStyle === 'noir' ? 'text-black opacity-40' : 'text-zinc-600'}`}>WWW.GOODCOPBADCOP.AI</div>
            </div>
          </div>
        </div>

        {/* CONTROLS PANEL */}
        <div className="w-full md:w-80 space-y-6 bg-zinc-900/40 p-8 border border-zinc-800 rounded-3xl backdrop-blur-xl">
          <div>
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Visual_Preset</h4>
            <div className="flex flex-col gap-3">
              {(['classic', 'noir', 'neon'] as StyleOption[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setActiveStyle(style)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between font-mono font-bold uppercase text-[10px] tracking-widest ${
                    activeStyle === style ? 'border-blue-600 bg-blue-600/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {style}.cfg
                  {activeStyle === style && <i className="fa-solid fa-circle-check text-blue-500"></i>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/50 space-y-4">
            <Button 
              className="w-full py-5 text-[11px] font-black tracking-[0.2em] bg-blue-600 hover:bg-blue-500" 
              onClick={handleDownload}
              isLoading={generating}
            >
              <i className="fa-solid fa-download mr-2"></i>
              SAVE_IMAGE
            </Button>
            <button 
              className="w-full py-4 text-[10px] font-mono font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors" 
              onClick={onClose}
            >
              DISCARD_RENDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
