
import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selected?: Category;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-12">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id as Category)}
          className={`relative group p-8 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
            selected === cat.id 
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
          }`}
        >
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
            <i className={`${cat.icon} text-8xl`}></i>
          </div>
          <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl`}>
            <i className={`${cat.icon} text-white`}></i>
          </div>
          <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
          <p className="text-zinc-500 text-sm">Roast your {cat.id === 'spotify' ? 'music taste' : cat.id === 'valorant' ? 'gaming skills' : 'watching habits'}.</p>
          
          {selected === cat.id && (
            <div className="absolute top-4 right-4 text-orange-500">
              <i className="fa-solid fa-circle-check text-xl"></i>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
