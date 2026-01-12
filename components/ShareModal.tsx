
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
    
    // Increased delay to ensure all assets and layout are fully rendered
    await new Promise(r => setTimeout(r, 300));

    try {
      // html2canvas works best when window dimensions are explicitly defined to match the target
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: activeStyle === 'noir' ? '#f4f4f2' : '#05070a',
        scale: 2, // 2x is plenty for mobile sharing and more stable than higher scales
        useCORS: true,
        logging: false,
        width: 320,
        height: 568,
        windowWidth: 320,
        windowHeight: 568,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('capture-target');
          if (el) {
            // Remove any potential shifts during cloning
            el.style.position = 'static';
            el.style.transform = 'none';
            el.style.margin = '0';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `GPBC-CASE-REPORT-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 0.9);
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Export failed. Please try a different style.');
    } finally {
      setGenerating(false);
    }
  };

  const getStyleClasses = () => {
    switch (activeStyle) {
      case 'noir':
        return 'bg-[#f4f4f2] text-[#1a1a1a] border-[10px] border-[#1a1a1a] font-serif';
      case 'neon':
        return 'bg-black text-white border-2 border-[#f97316]';
      default:
        return 'bg-[#05070a] text-white border border-zinc-800';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center justify-center py-10">
        
        {/* PREVIEW CONTAINER */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 font-mono text-zinc-500">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">RENDER_TARGET_9:16</span>
          </div>
          
          {/* THE CAPTURE TARGET - SIMPLEST POSSIBLE CSS FOR STABILITY */}
          <div 
            id="capture-target"
            ref={captureRef}
            className={`w-[320px] h-[568px] overflow-hidden relative p-8 text-center ${getStyleClasses()}`}
            style={{ boxSizing: 'border-box' }}
          >
            {/* 1. Header Area */}
            <div className="mt-8 mb-12">
              <div className={`text-[8px] font-mono font-bold uppercase tracking-[0.4em] mb-4 ${activeStyle === 'noir' ? 'opacity-60' : 'text-zinc-500'}`}>
                LOG_ID_{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <h2 className={`text-4xl font-black leading-tight tracking-tighter uppercase ${
                activeStyle === 'noir' ? 'text-black' : 
                activeStyle === 'neon' ? 'text-[#f97316]' : 
                'text-blue-500'
              }`}>
                GUILTY AS <br/>CHARGED.
              </h2>
              <div className={`text-[9px] font-bold uppercase tracking-widest mt-4 ${activeStyle === 'noir' ? 'opacity-80' : 'text-zinc-400'}`}>
                 CASE: {inputSummary.length > 20 ? inputSummary.substring(0, 17) + '...' : inputSummary}
              </div>
            </div>

            {/* 2. Score Area */}
            <div className="mb-12">
              <div className={`text-8xl font-black italic leading-none ${
                activeStyle === 'noir' ? 'text-black' : 
                activeStyle === 'neon' ? 'text-[#f97316]' : 
                'text-blue-500'
              }`}>
                {result.cookingLevel}<span className="text-2xl not-italic">/10</span>
              </div>
              <div className={`text-[8px] font-mono font-black uppercase tracking-[0.5em] mt-2 ${activeStyle === 'noir' ? 'opacity-50' : 'text-zinc-500'}`}>
                 HEAT_INDEX
              </div>
            </div>

            {/* 3. Verdict Area */}
            <div className="mb-10">
               <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 inline-block ${
                 activeStyle === 'noir' ? 'bg-black text-white' : 
                 activeStyle === 'neon' ? 'bg-[#f97316] text-white' : 
                 'bg-zinc-900 border border-zinc-800 text-zinc-400'
               }`}>
                {result.verdict}
              </div>
            </div>

            {/* 4. Rehab Area */}
            <div className={`pt-6 border-t ${activeStyle === 'noir' ? 'border-black/10' : 'border-zinc-800/40'} text-left`}>
              <div className={`text-[8px] font-mono font-bold uppercase tracking-widest mb-4 ${
                activeStyle === 'noir' ? 'text-black' : 
                activeStyle === 'neon' ? 'text-[#f97316]' : 
                'text-blue-500'
              }`}>
                REHAB_PLAN:
              </div>
              <div className="space-y-3">
                {result.recommendations.slice(0, 2).map((rec, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[9px] font-black opacity-50">{i+1}.</span>
                    <div className={`text-[9px] font-medium leading-tight ${
                      activeStyle === 'noir' ? 'text-black/80' : 'text-zinc-300'
                    }`}>
                      {rec.split(' with ')[0].substring(0, 60)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Footer Area */}
            <div className="absolute bottom-10 left-0 w-full text-center">
              <div className={`text-[6px] font-mono font-bold tracking-[0.3em] uppercase ${activeStyle === 'noir' ? 'opacity-40' : 'text-zinc-600'}`}>
                WWW.GOODCOPBADCOP.AI
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="w-full md:w-80 space-y-6 bg-zinc-900/40 p-8 border border-zinc-800 rounded-3xl">
          <div>
            <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-4">Preset_Config</h4>
            <div className="flex flex-col gap-2">
              {(['classic', 'noir', 'neon'] as StyleOption[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setActiveStyle(style)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between font-mono font-bold uppercase text-[10px] tracking-widest ${
                    activeStyle === style ? 'border-blue-600 bg-blue-600/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {style}.data
                  {activeStyle === style && <i className="fa-solid fa-check-circle text-blue-500"></i>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/50 space-y-4">
            <Button 
              className="w-full py-5 text-[11px] font-black tracking-widest bg-blue-600" 
              onClick={handleDownload}
              isLoading={generating}
            >
              <i className="fa-solid fa-file-image mr-2"></i>
              SAVE_CASE_FILE
            </Button>
            <button 
              className="w-full py-4 text-[10px] font-mono font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors" 
              onClick={onClose}
            >
              CLOSE_MODULE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
