
import React, { useState } from 'react';
import { Category, RoastData, RoastResult, SpotifyData, ValorantData, AnimeData } from './types';
import { generateRoast } from './services/geminiService';
import { CategorySelector } from './components/CategorySelector';
import { Button } from './components/Button';
import { RoastCard } from './components/RoastCard';
import { HowItWorks } from './components/HowItWorks';
import { HallOfShame } from './components/HallOfShame';

const App: React.FC = () => {
  const [step, setStep] = useState<'landing' | 'input' | 'cooking' | 'result' | 'how-it-works' | 'hall-of-shame'>('landing');
  const [category, setCategory] = useState<Category | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [spotifyInput, setSpotifyInput] = useState<string>('');
  const [valorantForm, setValorantForm] = useState<ValorantData>({
    username: '', rank: 'Silver', mainAgent: '', kd: '1.0', hsPercentage: '15'
  });
  const [animeForm, setAnimeForm] = useState<AnimeData>({
    topAnime: [], waifuHusband: '', episodesWatched: ''
  });

  const handleStart = () => setStep('input');

  const handleRoast = async () => {
    if (!category) return;
    setLoading(true);
    setError(null);
    setStep('cooking');

    let data: RoastData;
    if (category === 'spotify') {
      data = {
        topArtists: spotifyInput.split(',').map(s => s.trim()),
        topGenres: [],
        recentTracks: []
      } as SpotifyData;
    } else if (category === 'valorant') {
      data = valorantForm;
    } else {
      data = animeForm;
    }

    try {
      await new Promise(r => setTimeout(r, 2000));
      const roastResult = await generateRoast(category, data);
      setResult(roastResult);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    if (category === 'spotify') {
      return (
        <div className="space-y-4 max-w-xl mx-auto w-full">
          <label className="block text-sm font-bold uppercase tracking-wider text-zinc-500">Paste your top artists (comma separated)</label>
          <textarea 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 min-h-[120px]"
            placeholder="Taylor Swift, Drake, Radiohead, Baby Shark..."
            value={spotifyInput}
            onChange={(e) => setSpotifyInput(e.target.value)}
          />
          <p className="text-xs text-zinc-500 italic">Don't be shy. We can see those guilty pleasures anyway.</p>
        </div>
      );
    }

    if (category === 'valorant') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Riot ID</label>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 outline-none" 
              placeholder="Username#TAG"
              value={valorantForm.username}
              onChange={e => setValorantForm({...valorantForm, username: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Current Rank</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 outline-none"
              value={valorantForm.rank}
              onChange={e => setValorantForm({...valorantForm, rank: e.target.value})}
            >
              <option>Iron</option>
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
              <option>Platinum</option>
              <option>Diamond</option>
              <option>Ascendant</option>
              <option>Immortal</option>
              <option>Radiant</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Main Agent</label>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 outline-none" 
              placeholder="Jett, Sage, Omen..."
              value={valorantForm.mainAgent}
              onChange={e => setValorantForm({...valorantForm, mainAgent: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">KD Ratio</label>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 outline-none" 
              placeholder="0.8"
              value={valorantForm.kd}
              onChange={e => setValorantForm({...valorantForm, kd: e.target.value})}
            />
          </div>
        </div>
      );
    }

    if (category === 'anime') {
        return (
          <div className="space-y-4 max-w-xl mx-auto w-full">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Your Top 3 Anime (be honest)</label>
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 outline-none" 
                placeholder="Naruto, SAO, Rent-a-GF..."
                onChange={e => setAnimeForm({...animeForm, topAnime: e.target.value.split(',')})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Favorite Character / Waifu / Husband</label>
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 outline-none" 
                placeholder="Who's on your body pillow?"
                value={animeForm.waifuHusband}
                onChange={e => setAnimeForm({...animeForm, waifuHusband: e.target.value})}
              />
            </div>
          </div>
        );
      }
    return null;
  };

  const handleReset = () => {
    setStep('landing');
    setCategory(undefined);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-display">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-fire text-white"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter">COOKED<span className="text-orange-600">.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-400 uppercase tracking-widest">
          <button onClick={() => setStep('how-it-works')} className={`transition-colors hover:text-white ${step === 'how-it-works' ? 'text-white' : ''}`}>How it works</button>
          <button onClick={() => setStep('hall-of-shame')} className={`transition-colors hover:text-white ${step === 'hall-of-shame' ? 'text-white' : ''}`}>Hall of Shame</button>
          <Button variant="secondary" className="px-4 py-2 text-xs">Login</Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        
        {step === 'landing' && (
          <div className="text-center max-w-3xl animate-in fade-in zoom-in duration-500">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              YOUR TASTE IS <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">ABSOLUTELY TRASH.</span>
            </h1>
            <p className="text-xl text-zinc-500 mb-10 max-w-xl mx-auto font-medium">
              We use advanced AI to dismantle your ego based on your Spotify history, Valorant rank, or mid anime choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleStart} className="text-lg px-10 py-4 shadow-xl shadow-orange-600/20">
                GET COOKED NOW
              </Button>
              <Button variant="ghost" onClick={() => setStep('hall-of-shame')} className="text-lg px-10">
                VIEW HALL OF SHAME
              </Button>
            </div>
          </div>
        )}

        {step === 'how-it-works' && <HowItWorks onBack={handleReset} />}
        
        {step === 'hall-of-shame' && <HallOfShame onBack={handleReset} />}

        {step === 'input' && (
          <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">CHOOSE YOUR POISON</h2>
              <p className="text-zinc-500 font-medium">Select what you want us to rip apart today.</p>
            </div>
            
            <CategorySelector onSelect={setCategory} selected={category} />

            {category && (
              <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-300">
                {renderInput()}
                <Button 
                    variant="primary" 
                    className="mt-10 px-12 py-4" 
                    onClick={handleRoast}
                    disabled={category === 'spotify' ? !spotifyInput : false}
                >
                  START ROASTING
                </Button>
              </div>
            )}
            
            {error && (
                <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </div>
            )}
          </div>
        )}

        {step === 'cooking' && (
          <div className="flex flex-col items-center text-center py-20">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-orange-600 rounded-full blur-3xl opacity-50 absolute -top-4 -left-4 animate-pulse"></div>
              <i className="fa-solid fa-fire-burner text-8xl text-orange-600 flame-animation relative z-10"></i>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">PREHEATING THE OVEN...</h2>
            <div className="flex flex-col gap-2 text-zinc-500 font-bold uppercase tracking-widest text-sm">
                <span className="animate-pulse delay-75">Analyzing your mid taste...</span>
                <span className="animate-pulse delay-200">Generating insults...</span>
                <span className="animate-pulse delay-500">Checking for zero aura...</span>
            </div>
          </div>
        )}

        {step === 'result' && result && (
            <div className="w-full">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black mb-4 tracking-tighter italic uppercase">YOU'RE COOKED.</h2>
                    <p className="text-zinc-500">Chef Burnard has finished his masterpiece.</p>
                </div>
                <RoastCard result={result} onReset={handleReset} />
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-10 px-8 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">
          Powered by Gemini AI • Cooked with salt
        </p>
      </footer>
    </div>
  );
};

export default App;
