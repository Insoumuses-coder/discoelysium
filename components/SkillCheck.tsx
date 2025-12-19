
import React, { useState, useEffect } from 'react';
import { soundService } from '../services/soundService';

interface SkillCheckProps {
  skill: string;
  difficulty: number;
  onComplete: (success: boolean) => void;
}

const SkillCheck: React.FC<SkillCheckProps> = ({ skill, difficulty, onComplete }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<{ d1: number, d2: number, total: number } | null>(null);

  const roll = () => {
    soundService.playTypewriter();
    setRolling(true);
    // Simulate dice rolling sound loop
    const interval = setInterval(() => soundService.playTypewriter(), 150);
    
    setTimeout(() => {
      clearInterval(interval);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      setResult({ d1, d2, total });
      setRolling(false);
      onComplete(total >= difficulty);
      
      if (total >= difficulty) {
        soundService.playNeonBuzz();
      } else {
        soundService.playPaperTear();
      }
    }, 1500);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#ccff00] p-6 text-center shadow-[0_0_15px_rgba(204,255,0,0.3)]">
      <h3 className="text-[#ccff00] uppercase text-xl font-bold mb-4 tracking-widest">{skill} Check</h3>
      <p className="text-gray-400 mb-6">Difficulty: {difficulty}</p>
      
      {!result && !rolling && (
        <button 
          onClick={roll}
          onMouseEnter={() => soundService.playTypewriter()}
          className="bg-[#8a3324] hover:bg-[#a33c2a] text-[#e3dccb] px-8 py-2 font-bold uppercase transition-colors"
        >
          [ Roll 2D6 ]
        </button>
      )}

      {rolling && (
        <div className="flex justify-center gap-4">
          <div className="w-12 h-12 border-2 border-[#ccff00] animate-spin flex items-center justify-center text-xl">?</div>
          <div className="w-12 h-12 border-2 border-[#ccff00] animate-spin flex items-center justify-center text-xl">?</div>
        </div>
      )}

      {result && (
        <div className="animate-bounce">
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-12 h-12 border-2 border-[#ccff00] flex items-center justify-center text-2xl font-bold">{result.d1}</div>
            <div className="w-12 h-12 border-2 border-[#ccff00] flex items-center justify-center text-2xl font-bold">{result.d2}</div>
          </div>
          <p className={`text-2xl font-bold uppercase ${result.total >= difficulty ? 'text-[#ccff00]' : 'text-[#8a3324]'}`}>
            {result.total >= difficulty ? 'Success' : 'Failure'}
          </p>
          <button 
            onClick={() => {
              soundService.playTypewriter();
              setResult(null);
            }}
            className="mt-4 text-xs underline opacity-50 hover:opacity-100"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillCheck;
