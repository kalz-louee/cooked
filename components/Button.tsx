
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children,       
  variant = 'primary', 
  isLoading,      
  className = '', 
  ...props        
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
    danger: 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    ghost: 'bg-transparent hover:bg-zinc-800/50 text-zinc-400 border border-zinc-800',
  };

  return (
    <button
      className={`relative px-8 py-3 rounded-md font-mono font-bold uppercase text-xs tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Visual Corner Accents */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20"></div>

      {isLoading && (
        <i className="fa-solid fa-circle-notch animate-spin"></i>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
