
import React from 'react';
import { Button } from './Button';

interface HowItWorksProps {
  onBack: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  const steps = [
    {
      icon: 'fa-solid fa-database',
      title: 'Feed the beast',
      description: 'You provide us with your data—whether it is your questionable Spotify artists, your embarrassing Valorant stats, or your mid anime list.'
    },
    {
      icon: 'fa-solid fa-brain',
      title: 'AI Demolition',
      description: 'We send your information to Chef Burnard, an advanced Gemini AI specifically trained in the fine art of professional roasting.'
    },
    {
      icon: 'fa-solid fa-fire-extinguisher',
      title: 'Serve the pain',
      description: 'You receive a personalized, soul-crushing roast and a "Heat Level" from 1-10. Share it with friends or keep it hidden in shame.'
    }
  ];

  return (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black mb-4 tracking-tighter italic uppercase">HOW THE STOVE WORKS</h2>
        <p className="text-zinc-500 text-lg">Our proprietary roasting algorithm is simple but effective.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl relative">
            <div className="absolute -top-5 left-8 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-black italic text-lg shadow-lg shadow-orange-600/30">
              {idx + 1}
            </div>
            <div className="text-orange-500 text-3xl mb-6 mt-2">
              <i className={step.icon}></i>
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase">{step.title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onBack} variant="secondary">
          <i className="fa-solid fa-arrow-left"></i>
          Enough talk, roast me
        </Button>
      </div>
    </div>
  );
};
