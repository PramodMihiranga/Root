
import React from 'react';
import { motion } from 'motion/react';
import { TimeLeft } from '../types';

// Countdown presentation component

interface CountdownCardProps {
  timeLeft: TimeLeft;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ timeLeft }) => {
  const Unit: React.FC<{ value: number; label: string; colorClass: string }> = ({ value, label, colorClass }) => {
    const formattedValue = value.toString().padStart(2, '0');
    
    return (
      <div className="flex flex-col items-center group flex-1 min-w-0">
        <div className="countdown-card rounded-2xl md:rounded-[2.5rem] p-3 sm:p-5 md:p-8 w-full transition-all duration-500 hover:translate-y-[-4px] border-blue-400/20 relative">
          <div className={`absolute -right-4 -bottom-4 w-12 h-12 md:w-16 md:h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`} />
          
          <div className="flex gap-1 md:gap-2 mb-2 md:mb-4 justify-center">
            {formattedValue.split('').map((digit, idx) => (
              <div 
                key={idx} 
                className="digit-box rounded-lg md:rounded-2xl w-8 h-12 sm:w-10 sm:h-16 md:w-16 md:h-24 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 z-10" />
                <motion.span 
                  key={`${label}-${idx}-${digit}`} 
                  initial={{ opacity: 0, scale: 0.85, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
                  className="text-xl sm:text-3xl md:text-6xl font-black font-mono-tech text-white relative z-0"
                >
                  {digit}
                </motion.span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2 justify-center">
            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${colorClass} animate-pulse`} />
            <span className="text-[7px] sm:text-[9px] md:text-xs uppercase tracking-[0.15em] text-slate-400 font-black font-outfit truncate">
              {label}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row gap-2 md:gap-6 w-full max-w-5xl mx-auto px-1 md:px-4">
      <Unit value={timeLeft.days} label="Days" colorClass="bg-blue-500" />
      <Unit value={timeLeft.hours} label="Hours" colorClass="bg-indigo-500" />
      <Unit value={timeLeft.minutes} label="Mins" colorClass="bg-purple-500" />
      <Unit value={timeLeft.seconds} label="Secs" colorClass="bg-cyan-500" />
    </div>
  );
};

export default CountdownCard;
