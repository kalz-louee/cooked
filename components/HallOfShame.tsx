
// Import React
import React from 'react';
// Import our custom Button component
import { Button } from './Button';

// Props for the page
interface HallOfShameProps {
  onBack: () => void; // Function to go back to home
}

// The HallOfShame component function
export const HallOfShame: React.FC<HallOfShameProps> = ({ onBack }) => {
  // A list of fake (mock) roasts to show as examples of the AI's power
  const roasts = [
    {
      user: "BasicBecca_99",
      type: "Spotify",
      roast: "Listening to Taylor Swift on repeat isn't a personality, it's a cry for a therapist who won't charge you extra for trauma-dumping about your 3rd grade breakup. Your most listened song is a soundtrack for people who think unseasoned chicken is 'too spicy'.",
      level: 9,
      verdict: "ULTRA BASIC"
    },
    {
      user: "GamerPro420",
      type: "Gaming",
      roast: "You're still playing League of Legends in 2024? That's not a hobby, it's a diagnosis. 2,000 hours and you're still stuck in Silver 4 playing Yasuo with a 30% win rate. The only thing you're 'carrying' is a sense of regret.",
      level: 8,
      verdict: "HARDSTUCK TRASH"
    },
    {
      user: "OtakuKing",
      type: "Anime",
      roast: "You actually sat through 25 episodes of Rent-a-Girlfriend and didn't realize you were looking in a mirror? That waifu on your wallpaper has more personality than your actual social life, and she's literally made of pixels.",
      level: 10,
      verdict: "ZERO AURA"
    }
  ];

  return (
    // Main container with entry animation
    <div className="max-w-5xl w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
      {/* Title section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black mb-4 tracking-tighter italic uppercase">HALL OF SHAME</h2>
        <p className="text-zinc-500 text-lg">The absolute hardest burns Chef Burnard has ever served.</p>
      </div>

      {/* Grid showing the roast cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {roasts.map((r, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col hover:border-orange-500/50 transition-all group">
            {/* User info and heat score */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{r.type} Roast</span>
                <h4 className="text-white font-bold">@{r.user}</h4>
              </div>
              <div className="text-orange-600 font-black text-xl italic">
                {r.level}/10
              </div>
            </div>
            
            {/* The roast text */}
            <p className="text-zinc-300 italic text-sm leading-relaxed flex-1 mb-6">
              "{r.roast}"
            </p>

            {/* Bottom info: verdict and timestamp */}
            <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-orange-500 tracking-tighter">{r.verdict}</span>
                <span className="text-[10px] font-bold text-zinc-600">3 HOURS AGO</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons at the bottom */}
      <div className="flex justify-center gap-4">
        <Button onClick={onBack} variant="ghost">
           Go Back
        </Button>
        <Button onClick={() => window.location.reload()} variant="primary">
           Join the Hall of Shame
        </Button>
      </div>
    </div>
  );
};
