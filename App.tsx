
import React, { useState, useEffect } from 'react';
import { Category, RoastData, RoastResult, SpotifyData, GamingData, AnimeData } from './types';
import { generateRoast } from './services/geminiService';
import { CategorySelector } from './components/CategorySelector';
import { Button } from './components/Button';
import { RoastCard } from './components/RoastCard';
import { HowItWorks } from './components/HowItWorks';
import { HallOfShame } from './components/HallOfShame';
import { ShareModal } from './components/ShareModal';

const App: React.FC = () => {
  const [step, setStep] = useState<'landing' | 'input' | 'cooking' | 'result' | 'how-it-works' | 'hall-of-shame'>('landing');
  const [category, setCategory] = useState<Category | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  // Input States
  const [spotifyInput, setSpotifyInput] = useState<string>('');
  const [gamingForm, setGamingForm] = useState<GamingData>({ gameTitle: '', rank: '', playstyle: '', stats: '' });
  const [animeForm, setAnimeForm] = useState<AnimeData>({ topAnime: [], waifuHusband: '', episodesWatched: '' });

  // Dynamic system clock for the header
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => setStep('input');

  const handleRoast = async () => {
    if (!category) return;
    setLoading(true);
    setError(null);
    setStep('cooking');

    let data: RoastData;
    if (category === 'spotify') {
      data = { topArtists: spotifyInput.split(',').map(s => s.trim()), topGenres: [], recentTracks: [] } as SpotifyData;
    } else if (category === 'gaming') {
      data = gamingForm;
    } else {
      data = animeForm;
    }

    try {
      await new Promise(r => setTimeout(r, 3000));
      const roastResult = await generateRoast(category, data);
      setResult(roastResult);
      setStep('result');
    } catch (err: any) {
      // User-friendly error message
      setError("System Overload: Our AI cops are currently busy interrogating other suspects. Please try again in a few moments.");
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectSummary = () => {
    if (category === 'spotify') return spotifyInput.split(',')[0] || 'Spotify Library';
    if (category === 'gaming') return gamingForm.gameTitle || 'Gaming Stats';
    if (category === 'anime') return animeForm.topAnime[0] || 'Anime List';
    return 'Dossier';
  };

  const renderInput = () => {
    const baseInputClass = "w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm placeholder:text-zinc-600 transition-all";
    
    if (category === 'spotify') {
      return (
        <div className="space-y-4 max-w-xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">Dossier: Musical Preferences</label>
          </div>
          <textarea 
            className={`${baseInputClass} min-h-[140px]`}
            placeholder="Input Artist Data (comma separated)..."
            value={spotifyInput}
            onChange={(e) => setSpotifyInput(e.target.value)}
          />
        </div>
      );
    }
    if (category === 'gaming') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
          {Object.keys(gamingForm).map((key) => (
            <div key={key}>
              <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 font-mono ml-1 mb-1 block">
                {key.replace(/([A-Z])/g, ' $1')} Data
              </label>
              <input 
                className={baseInputClass}
                placeholder={`Enter ${key}...`} 
                value={(gamingForm as any)[key]} 
                onChange={e => setGamingForm({...gamingForm, [key]: e.target.value})} 
              />
            </div>
          ))}
        </div>
      );
    }
    if (category === 'anime') {
      return (
        <div className="space-y-4 max-w-xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
          <input className={baseInputClass} placeholder="Target Anime Series..." onChange={e => setAnimeForm({...animeForm, topAnime: e.target.value.split(',')})} />
          <input className={baseInputClass} placeholder="Designated Waifu/Husband..." value={animeForm.waifuHusband} onChange={e => setAnimeForm({...animeForm, waifuHusband: e.target.value})} />
        </div>
      );
    }
    return null;
  };

  const handleReset = () => {
    setStep('landing');
    setCategory(undefined);
    setResult(null);
    setIsShareModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      {/* TACTICAL HEADER */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleReset}>
          <div className="flex items-center border border-zinc-800 rounded overflow-hidden">
            <div className="px-2 py-1 bg-blue-600 text-[10px] font-black tracking-tighter">GOOD</div>
            <div className="px-2 py-1 bg-orange-600 text-[10px] font-black tracking-tighter">BAD</div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">SYSTEM.COP</span>
            <span className="text-[8px] font-mono text-blue-500 uppercase tracking-widest font-bold">Protocol v2.4.0</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span>System: Online</span>
          </div>
          <button onClick={() => setStep('how-it-works')} className="hover:text-white transition-colors">Methodology</button>
          <button onClick={() => setStep('hall-of-shame')} className="hover:text-white transition-colors">Evidence_Log</button>
          <div className="text-zinc-600">{systemTime}</div>
        </div>
      </nav>

      <main className="flex-1 relative flex flex-col items-center justify-center px-4 overflow-hidden">
        
        {step === 'landing' && (
          <div className="text-center max-w-5xl z-10 animate-in fade-in zoom-in duration-700">
            <div className="inline-block px-4 py-1 border border-blue-500/30 rounded-full mb-8 bg-blue-500/5">
              <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-blue-400 uppercase">Awaiting Subject Input</span>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black mb-8 leading-[0.85] uppercase tracking-tighter">
              YOU ARE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700">GUILTY.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 mb-12 font-medium max-w-xl mx-auto leading-relaxed uppercase tracking-wide">
              Initial taste analysis indicates a 98.4% probability of absolute trash tier choices.
            </p>
            <div className="relative group inline-block">
               <div className="absolute -inset-1 bg-blue-500 blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <Button onClick={handleStart} className="relative px-12 py-5 text-xl font-black bg-blue-600 border border-blue-400/50 shadow-2xl">
                 COMMENCE SCREENING
               </Button>
            </div>
          </div>
        )}

        {step === 'how-it-works' && <HowItWorks onBack={handleReset} />}
        {step === 'hall-of-shame' && <HallOfShame onBack={handleReset} />}
        
        {step === 'cooking' && (
          <div className="text-center relative py-20 px-10 border border-zinc-800 bg-zinc-950/50 rounded-2xl tactical-border crt-flicker">
            <div className="scanner-line"></div>
            <div className="mb-12">
               <i className="fa-solid fa-microchip text-7xl text-blue-500 mb-6 block animate-pulse"></i>
               <h2 className="text-4xl font-black uppercase italic tracking-widest text-white">INTERROGATING...</h2>
               <p className="text-zinc-500 font-mono text-xs mt-4 uppercase tracking-[0.2em]">Analyzing neural patterns of mid behavior</p>
            </div>
            <div className="space-y-2 max-w-xs mx-auto">
               <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-[loading_3s_ease-in-out_infinite]" style={{width: '60%'}}></div>
               </div>
               <div className="flex justify-between font-mono text-[9px] text-zinc-600 font-bold uppercase">
                  <span>Logic Processor</span>
                  <span>78.4%</span>
               </div>
            </div>
          </div>
        )}
        
        {step === 'input' && (
            <div className="w-full text-center max-w-6xl animate-in fade-in slide-in-from-bottom-8">
                <div className="mb-10">
                  <h2 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">SELECT EVIDENCE FILE</h2>
                  <div className="h-0.5 w-24 bg-blue-500 mx-auto"></div>
                </div>
                
                <CategorySelector onSelect={setCategory} selected={category} />
                
                {category && (
                  <div className="mt-12 p-8 bg-zinc-950/50 border border-zinc-800 rounded-2xl tactical-border animate-in fade-in slide-in-from-top-4 max-w-2xl mx-auto">
                    {renderInput()}
                    <Button 
                      className="mt-10 px-16 py-4 bg-blue-600 hover:bg-blue-500 border-t border-blue-400/30 text-sm tracking-[0.2em] font-black uppercase" 
                      onClick={handleRoast}
                    >
                      EXECUTE ANALYSIS
                    </Button>
                  </div>
                )}
                {error && (
                  <div className="mt-8 p-6 bg-red-950/20 border border-red-900/50 rounded-lg text-red-500 font-mono text-xs uppercase tracking-[0.15em] animate-in fade-in slide-in-from-top-4 max-w-xl mx-auto leading-relaxed">
                    <div className="flex items-center justify-center gap-3 mb-2">
                       <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                       <span className="font-black">CRITICAL ERROR</span>
                    </div>
                    {error}
                  </div>
                )}
            </div>
        )}

        {step === 'result' && result && (
          <RoastCard 
            result={result} 
            onReset={handleReset} 
            onOpenShare={() => setIsShareModalOpen(true)} 
          />
        )}

      </main>

      {isShareModalOpen && result && (
        <ShareModal 
          result={result} 
          category={category || 'spotify'}
          inputSummary={getSubjectSummary()}
          onClose={() => setIsShareModalOpen(false)} 
        />
      )}

      <footer className="py-6 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center bg-zinc-950/50">
        <div className="text-zinc-600 text-[9px] font-mono font-bold uppercase tracking-widest mb-4 md:mb-0">
          Terminal Status: <span className="text-green-500">Secured</span> | Latency: 42ms | Roast_Engine: Stable
        </div>
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-tighter">GOOD COP BAD COP // EST. 2024</p>
      </footer>
    </div>
  );
};

export default App;
