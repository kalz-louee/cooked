
// Import React and the "useState" hook to manage data that changes over time
import React, { useState } from 'react';
// Import our internal types
import { Category, RoastData, RoastResult, SpotifyData, ValorantData, AnimeData } from './types';
// Import the logic that talks to the AI
import { generateRoast } from './services/geminiService';
// Import our UI components
import { CategorySelector } from './components/CategorySelector';
import { Button } from './components/Button';
import { RoastCard } from './components/RoastCard';
import { HowItWorks } from './components/HowItWorks';
import { HallOfShame } from './components/HallOfShame';

const App: React.FC = () => {
  /**
   * STATE MANAGEMENT: These variables hold the "current status" of the app.
   * When they change, React automatically redraws the screen.
   */
  // Track which screen the user is currently on
  const [step, setStep] = useState<'landing' | 'input' | 'cooking' | 'result' | 'how-it-works' | 'hall-of-shame'>('landing');
  // Track which category (Spotify, etc) is selected
  const [category, setCategory] = useState<Category | undefined>();
  // Tracks if the AI is currently "thinking"
  const [loading, setLoading] = useState(false);
  // Stores the final roast we get back from the AI
  const [result, setResult] = useState<RoastResult | null>(null);
  // Stores any errors that happen during the process
  const [error, setError] = useState<string | null>(null);

  /**
   * FORM STATES: Specific inputs for each category
   */
  const [spotifyInput, setSpotifyInput] = useState<string>('');
  const [valorantForm, setValorantForm] = useState<ValorantData>({
    username: '', rank: 'Silver', mainAgent: '', kd: '1.0', hsPercentage: '15'
  });
  const [animeForm, setAnimeForm] = useState<AnimeData>({
    topAnime: [], waifuHusband: '', episodesWatched: ''
  });

  // Helper function to switch to the input screen
  const handleStart = () => setStep('input');

  // The main function triggered when the user clicks "Start Roasting"
  const handleRoast = async () => {
    if (!category) return;
    setLoading(true); // Start loading spinner logic
    setError(null);    // Clear old errors
    setStep('cooking'); // Switch to the high-energy cooking screen

    let data: RoastData;
    // Bundle the correct data based on the active category
    if (category === 'spotify') {
      data = { topArtists: spotifyInput.split(',').map(s => s.trim()), topGenres: [], recentTracks: [] } as SpotifyData;
    } else if (category === 'valorant') {
      data = valorantForm;
    } else {
      data = animeForm;
    }

    try {
      // Wait for 2 seconds to make the "cooking" animation feel more satisfying
      await new Promise(r => setTimeout(r, 2000));
      // Call the AI service
      const roastResult = await generateRoast(category, data);
      // Save the result and show the final card
      setResult(roastResult);
      setStep('result');
    } catch (err: any) {
      // If AI fails, show the error and go back to input
      setError(err.message || 'Something went wrong');
      setStep('input');
    } finally {
      setLoading(false); // Stop loading logic
    }
  };

  /**
   * RENDER HELPERS: Functions that return different HTML chunks based on category
   */
  const renderInput = () => {
    if (category === 'spotify') {
      return (
        <div className="space-y-4 max-w-xl mx-auto w-full">
          <label className="block text-sm font-bold uppercase tracking-wider text-zinc-500">Paste your top artists (comma separated)</label>
          <textarea 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 min-h-[120px]"
            placeholder="Taylor Swift, Drake, Radiohead..."
            value={spotifyInput}
            onChange={(e) => setSpotifyInput(e.target.value)}
          />
        </div>
      );
    }
    // ... logic for other forms (Valorant/Anime) omitted for brevity in comments, follows same pattern
    if (category === 'valorant') {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
            <input className="bg-zinc-900 border border-zinc-800 p-3 rounded" placeholder="Username" value={valorantForm.username} onChange={e => setValorantForm({...valorantForm, username: e.target.value})} />
            <select className="bg-zinc-900 border border-zinc-800 p-3 rounded" value={valorantForm.rank} onChange={e => setValorantForm({...valorantForm, rank: e.target.value})}>
                <option>Silver</option><option>Gold</option><option>Diamond</option>
            </select>
          </div>
        );
    }
    return null;
  };

  // Reset the app to its original state
  const handleReset = () => {
    setStep('landing');
    setCategory(undefined);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-display">
      {/* NAVIGATION BAR: Stays at the top */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-fire text-white"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter">COOKED<span className="text-orange-600">.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-400 uppercase tracking-widest">
          <button onClick={() => setStep('how-it-works')} className="hover:text-white transition-colors">How it works</button>
          <button onClick={() => setStep('hall-of-shame')} className="hover:text-white transition-colors">Hall of Shame</button>
          <Button variant="secondary" className="px-4 py-2 text-xs">Login</Button>
        </div>
      </nav>

      {/* MAIN VIEWPORT: Changes based on the "step" state */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        
        {step === 'landing' && (
          <div className="text-center max-w-3xl animate-in fade-in zoom-in">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">YOUR TASTE IS <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">ABSOLUTELY TRASH.</span></h1>
            <p className="text-xl text-zinc-500 mb-10 font-medium">We use advanced AI to dismantle your ego based on your life choices.</p>
            <div className="flex gap-4"><Button onClick={handleStart}>GET COOKED NOW</Button></div>
          </div>
        )}

        {/* These components are shown conditionally based on the "step" variable */}
        {step === 'how-it-works' && <HowItWorks onBack={handleReset} />}
        {step === 'hall-of-shame' && <HallOfShame onBack={handleReset} />}
        {step === 'cooking' && <div className="text-center"><i className="fa-solid fa-fire text-8xl text-orange-600 flame-animation"></i><h2 className="text-2xl font-bold mt-4">PREHEATING THE OVEN...</h2></div>}
        
        {step === 'input' && (
            <div className="w-full text-center">
                <CategorySelector onSelect={setCategory} selected={category} />
                {category && <div className="mt-8">{renderInput()}<Button className="mt-8" onClick={handleRoast}>ROAST ME</Button></div>}
            </div>
        )}

        {step === 'result' && result && <RoastCard result={result} onReset={handleReset} />}

      </main>

      <footer className="py-10 text-center border-t border-white/5">
        <p className="text-zinc-600 text-sm font-bold uppercase">Powered by Gemini AI • Cooked with salt</p>
      </footer>
    </div>
  );
};

export default App;
