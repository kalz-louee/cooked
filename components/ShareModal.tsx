
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
    
    // Ensure all styles and fonts are ready
    await new Promise(r => setTimeout(r, 250));

    try {
      // Explicitly capture at exactly 320x568 for 9:16 aspect ratio
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: activeStyle === 'noir' ? '#ffffff' : '#05070a',
        scale: 4, 
        useCORS: true,
        logging: false,
        width: 320,
        height: 568,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('capture-target');
          if (el) {
            el.style.transform = 'none';
            el.style.display = 'block';
            el.style.visibility = 'visible';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `GPBC-CASE-REPORT-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Extraction error. Please try another style preset.');
    } finally {
      setGenerating(false);
    }
  };

  const getStyleClasses = () => {
    switch (activeStyle) {
      case 'noir':
        return 'bg-white text-black font-serif border-[12px] border-black';
      case 'neon':
        return 'bg-black text-white border-4 border-orange-500 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)]';
      default:
        return 'bg-[#05070a] text-white border border-zinc-800';
    }
  };

  const getBackgroundOverlay = () => {
    if (activeStyle === 'noir') {
      return (
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 0)', backgroundSize: '10px 10px' }}>
        </div>
      );
    }
    if (activeStyle === 'neon') {
       return (
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.2) 1px, transparent 1px)', backgroundSize: '100% 6px' }}>
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
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Render_Evidence</h3>
          </div>
          
          {/* THE SHAREABLE CARD - USING ABSOLUTE ELEMENTS AND BLOCK LAYOUT FOR CAPTURE STABILITY */}
          <div 
            id="capture-target"
            ref={captureRef}
            className={`w-[320px] h-[568px] overflow-hidden relative ${getStyleClasses()}`}
            style={{ boxSizing: 'border-box', display: 'block' }}
          >
            {getBackgroundOverlay()}
            
            {/* Header */}
            <div className="absolute top-10 left-0 w-full text-center z-10 px-6">
              <div className={`text-[8px] font-mono font-bold uppercase tracking-[0.4em] mb-4 ${activeStyle === 'noir' ? 'text-black opacity-60' : 'text-zinc-500'}`}>
                INTEL_LOG_{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <h2 className={`text-4xl font-black leading-none tracking-tighter mb-2 ${activeStyle === 'noir' ? 'text-black uppercase' : activeStyle === 'neon' ? 'text-orange-500' : 'text-blue-500'}`}>
                GUILTY AS <br/>CHARGED.
              </h2>
              <div className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${activeStyle === 'noir' ? 'text-black' : 'text-zinc-400'}`}>
                 Target: {inputSummary.length > 20 ? inputSummary.substring(0, 17) + '...' : inputSummary}
              </div>
            </div>

            {/* Central Heat Index */}
            <div className="absolute top-[180px] left-0 w-full text-center z-10">
              <div className={`text-8xl font-black italic tracking-tighter leading-none ${activeStyle === 'noir' ? 'text-black' : activeStyle === 'neon' ? 'text-orange-500' : 'text-blue-500'}`}>
                {result.cookingLevel}<span className="text-2xl not-italic">/10</span>
              </div>
              <div className={`text-[8px] font-mono font-black uppercase tracking-[0.5em] mt-1 ${activeStyle === 'noir' ? 'text-black opacity-60' : 'text-zinc-500'}`}>
                 HEAT_LEVEL
              </div>
            </div>

            {/* Verdict Box */}
            <div className="absolute top-[300px] left-6 right-6 text-center z-10">
               <div className={`text-[10px] font-black uppercase tracking-widest inline-block px-4 py-1.5 mb-4 ${activeStyle === 'noir' ? 'bg-black text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}>
                Verdict: {result.verdict}
              </div>
            </div>

            {/* Redemption Summary */}
            <div className="absolute top-[365px] left-8 right-8 text-left z-10 pt-6 border-t border-zinc-800/20">
              <div className={`text-[8px] font-mono font-bold uppercase tracking-widest mb-4 ${activeStyle === 'noir' ? 'text-black' : 'text-blue-500'}`}>
                Rehab_Protocol
              </div>
              <div className="space-y-3">
                {result.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`text-[9px] font-black ${activeStyle === 'noir' ? 'text-black' : 'text-blue-600'}`}>{i+1}.</span>
                    <div className={`text-[9px] font-medium leading-tight ${activeStyle === 'noir' ? 'text-black/80' : 'text-zinc-300'}`}>
                      {rec.split(' with ')[0].split(':')[0].substring(0, 50)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-10 left-0 w-full text-center z-10">
              <div className="inline-flex items-center justify-center mb-2">
                 <div className="flex items-center border border-current rounded-sm">
                   <div className={`px-1.5 py-0.5 text-[8px] font-black ${activeStyle === 'noir' ? 'bg-black text-white' : 'bg-blue-600 text-white'}`}>GOOD</div>
                   <div className={`px-1.5 py-0.5 text-[8px] font-black ${activeStyle === 'noir' ? 'bg-white text-black border-l border-black' : 'bg-orange-600 text-white'}`}>BAD</div>
                 </div>
                 <span className={`ml-2 text-[10px] font-black uppercase tracking-widest ${activeStyle === 'noir' ? 'text-black' : 'text-white'}`}>COP</span>
              </div>
              <div className={`text-[6px] font-mono font-bold tracking-[0.3em] ${activeStyle === 'noir' ? 'text-black opacity-50' : 'text-zinc-600'}`}>WWW.GOODCOPBADCOP.AI</div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="w-full md:w-80 space-y-6 bg-zinc-900/40 p-8 border border-zinc-800 rounded-3xl backdrop-blur-xl">
          <div>
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Visual_Mode</h4>
            <div className="flex flex-col gap-3">
              {(['classic', 'noir', 'neon'] as StyleOption[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setActiveStyle(style)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between font-mono font-bold uppercase text-[10px] tracking-widest ${
                    activeStyle === style ? 'border-blue-600 bg-blue-600/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {style}.data
                  {activeStyle === style && <i className="fa-solid fa-check text-blue-500"></i>}
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
              SAVE_REPORT
            </Button>
            <button 
              className="w-full py-4 text-[10px] font-mono font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors" 
              onClick={onClose}
            >
              Discard_Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
