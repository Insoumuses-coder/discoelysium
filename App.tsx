
import React, { useState, useEffect } from 'react';
import ThoughtCabinet from './components/ThoughtCabinet';
import SkillCheck from './components/SkillCheck';
import { DEFAULT_SKILLS, COLORS } from './constants';

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-[#ccff00] selection:text-black">
      {/* HERO SECTION */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center grayscale contrast-125 brightness-50"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1920&auto=format&fit=crop')",
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter text-transparent italic -rotate-3 neon-flicker" style={{ WebkitTextStroke: '2px #ccff00' }}>
            REVACHOL
          </h1>
          <div className="mt-8 bg-[#1a1a1a] p-4 border border-[#e3dccb] shadow-[8px_8px_0_#8a3324] rotate-1 inline-block max-w-lg">
            <p className="text-sm md:text-lg italic font-serif">
              "Every window in Martinaise is a dark eye, watching you fail. 
              The city is a beautiful corpse, and you're the parasite picking at its teeth."
            </p>
          </div>
        </div>
      </header>

      {/* SYNOPSIS / INTERACTIVE THOUGHTS */}
      <section className="py-24 px-4 bg-[#1a1a1a] relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#e3dccb] text-[#1a1a1a] p-8 torn-paper inner-shadow-paper">
                <h2 className="text-2xl font-serif font-bold mb-4 uppercase border-b border-[#1a1a1a] pb-2">Case File #412</h2>
                <p className="text-sm font-bold opacity-70 mb-4 italic">Detective H. Du Bois (Current status: Fragmented)</p>
                <p className="leading-relaxed mb-6 italic">
                  You woke up in a motel room with a headache that feels like a industrial press. 
                  Your memory is a blank slate of misery. Outside, the RCM is waiting. 
                  The harbor is on strike. A man is hanging from a tree.
                </p>
                <div className="space-y-4">
                  <SkillCheck 
                    skill="Logic" 
                    difficulty={8} 
                    onComplete={(success) => console.log('Logic check:', success)} 
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="mb-8">
                <h3 className="text-[#ccff00] uppercase text-xs tracking-[0.3em] font-bold mb-4">Internal Dialogue Simulator</h3>
                <ThoughtCabinet />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / SKILLS */}
      <section className="py-24 bg-[#111] border-y border-[#4a4a4a]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-black text-[#8a3324] mb-16 text-center underline decoration-wavy decoration-[#ccff00] underline-offset-8">
            THE 24 VOICES IN YOUR HEAD
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DEFAULT_SKILLS.map((skill, idx) => (
              <div key={idx} className="group relative bg-[#1a1a1a] border border-[#4a4a4a] p-6 hover:border-[#ccff00] transition-all hover:-translate-y-2 hover:rotate-1">
                <div className="h-48 mb-6 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all torn-paper-sm"
                     style={{ backgroundImage: `url('https://picsum.photos/seed/${skill.name}/400/400')` }} />
                <h4 className="text-[#e3dccb] text-xl font-serif font-bold mb-2">{skill.name}</h4>
                <p className="text-[#ccff00] text-[10px] uppercase tracking-widest mb-3">{skill.type}</p>
                <p className="text-gray-500 text-sm italic">{skill.description}</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 ${i < skill.level ? 'bg-[#ccff00]' : 'bg-gray-800'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 relative flex flex-col items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#8a3324] opacity-80 z-0" />
        <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-30 z-0" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518365050014-70fe7232897f?q=80&w=1920&auto=format&fit=crop')" }} />
        
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h2 className="text-5xl font-serif font-black text-[#e3dccb] mb-8 leading-tight italic">
            "Sober up, or don't. The world ends either way."
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-[#1a1a1a] text-[#ccff00] px-10 py-5 font-serif font-bold uppercase text-xl torn-paper hover:bg-[#e3dccb] hover:text-[#8a3324] transition-all hover:scale-105 shadow-2xl">
              Buy on Steam
            </button>
            <button className="bg-[#1a1a1a] text-[#ccff00] px-10 py-5 font-serif font-bold uppercase text-xl torn-paper hover:bg-[#e3dccb] hover:text-[#8a3324] transition-all hover:scale-105 shadow-2xl">
              Buy on GOG
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 text-center border-t-8 border-[#4a4a4a]">
        <div className="mb-8 flex justify-center gap-8 text-[#4a4a4a] text-sm uppercase tracking-widest font-bold">
          <span className="hover:text-[#ccff00] cursor-pointer">Bilibili</span>
          <span className="hover:text-[#ccff00] cursor-pointer">Twitter</span>
          <span className="hover:text-[#ccff00] cursor-pointer">Discord</span>
        </div>
        <p className="text-gray-600 text-[10px] leading-relaxed max-w-md mx-auto italic">
          © 2025 ZA/UM. DISCO ELYSIUM® IS A TRADEMARK OF ZA/UM. ALL RIGHTS RESERVED. 
          DEVELOPED BY FRAGMENTED THOUGHTS. 
          <br /><br />
          Dedicated to the failures, the broken, and those who still hear the city speak.
        </p>
      </footer>
    </div>
  );
};

export default App;
