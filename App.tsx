
import React, { useState, useEffect, useRef } from 'react';
import ThoughtCabinet from './components/ThoughtCabinet';
import SkillCheck from './components/SkillCheck';
import { DEFAULT_SKILLS, I18N } from './constants';
import { Locale } from './types';

const Typewriter: React.FC<{ text: string; delay?: number }> = ({ text, delay = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [index, text, delay]);

  return (
    <p className="leading-relaxed mb-6 italic font-serif">
      {displayedText}
      {index < text.length && <span className="animate-pulse">|</span>}
    </p>
  );
};

const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>('en');
  const [theme, setTheme] = useState<'night' | 'day'>('night');
  const [scrollY, setScrollY] = useState(0);
  const t = I18N[locale];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLocale = () => setLocale(prev => prev === 'en' ? 'zh' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'night' ? 'day' : 'night');

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      theme === 'night' ? 'bg-[#1a1a1a] text-[#e3dccb]' : 'bg-[#e3dccb] text-[#1a1a1a]'
    }`}>
      {/* PERSISTENT HUD */}
      <div className="fixed top-6 right-6 z-[100] flex gap-4">
        <button 
          onClick={toggleLocale}
          className="bg-black/80 text-[#ccff00] border border-[#ccff00] px-3 py-1 text-xs font-bold uppercase hover:bg-[#ccff00] hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
        >
          {locale === 'en' ? 'ZH/EN' : 'EN/中文'}
        </button>
        <button 
          onClick={toggleTheme}
          className="bg-black/80 text-[#ccff00] border border-[#ccff00] px-3 py-1 text-xs font-bold uppercase hover:bg-[#ccff00] hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
        >
          {theme === 'night' ? t.themeNocturnal : t.themeDiurnal}
        </button>
      </div>

      {/* HERO */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden border-b-8 border-current">
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ${
            theme === 'night' ? 'grayscale contrast-125 brightness-50' : 'sepia contrast-75 brightness-75'
          }`}
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1920&auto=format&fit=crop')",
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-[12rem] font-serif font-black tracking-tighter text-transparent italic -rotate-2 neon-flicker pointer-events-none select-none" 
              style={{ WebkitTextStroke: theme === 'night' ? '2px #ccff00' : '2px #8a3324' }}>
            REVACHOL
          </h1>
          <div className="mt-8 bg-black/90 p-6 border border-current shadow-[12px_12px_0_#8a3324] rotate-1 inline-block max-w-xl backdrop-blur-md">
            <p className="text-sm md:text-xl italic font-serif text-[#e3dccb]">
              {t.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* NARRATIVE SECTION */}
      <section className="py-24 px-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
              <div className="bg-[#e3dccb] text-[#1a1a1a] p-10 torn-paper inner-shadow-paper relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#8a3324] opacity-20" />
                <h2 className="text-3xl font-serif font-bold mb-6 uppercase border-b-2 border-black/10 pb-4">
                  {t.caseFileHeader}
                </h2>
                <p className="text-[10px] font-bold opacity-60 mb-6 tracking-widest uppercase">
                  DETECTIVE: H. DU BOIS // STATUS: FRAGMENTED
                </p>
                <Typewriter text={t.caseFileContent} />
                
                <div className="mt-10 border-t border-black/5 pt-8">
                  <SkillCheck 
                    skill={locale === 'en' ? "Logic" : "逻辑"} 
                    difficulty={8} 
                    onComplete={() => {}} 
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="mb-12">
                <h3 className="text-[#ccff00] uppercase text-xs tracking-[0.4em] font-black mb-6 flex items-center gap-4">
                   <span className="h-px flex-1 bg-current opacity-30" />
                   {t.thoughtCabinetTitle}
                   <span className="h-px flex-1 bg-current opacity-30" />
                </h3>
                <ThoughtCabinet locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS GRID */}
      <section className="py-24 border-y-2 border-current bg-black/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-5xl font-serif font-black mb-20 text-center underline decoration-wavy underline-offset-12 ${
            theme === 'night' ? 'text-[#8a3324] decoration-[#ccff00]' : 'text-[#8a3324] decoration-black'
          }`}>
            {t.skillsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {DEFAULT_SKILLS.map((skill, idx) => (
              <div key={idx} className={`group relative p-8 border border-current hover:shadow-[10px_10px_0_currentColor] transition-all hover:-translate-y-2 hover:-rotate-1 ${
                theme === 'night' ? 'bg-[#111]' : 'bg-white/50'
              }`}>
                <div className="h-40 mb-8 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all torn-paper-sm border border-current/20"
                     style={{ backgroundImage: `url('https://picsum.photos/seed/${skill.name}/400/400')` }} />
                <h4 className="text-2xl font-serif font-black mb-2 uppercase">{skill.name}</h4>
                <p className="text-[#ccff00] text-[10px] uppercase font-bold tracking-[0.2em] mb-4 bg-black px-2 py-1 inline-block">
                  {skill.type}
                </p>
                <p className="opacity-70 text-sm italic leading-relaxed min-h-[3rem]">{skill.description}</p>
                <div className="mt-8 flex gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 transition-colors ${i < skill.level ? 'bg-[#ccff00]' : 'bg-gray-800'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 relative flex flex-col items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#8a3324] opacity-90 z-0" />
        <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-40 z-0" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518365050014-70fe7232897f?q=80&w=1920&auto=format&fit=crop')" }} />
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h2 className="text-5xl md:text-7xl font-serif font-black text-[#e3dccb] mb-12 leading-tight italic -rotate-1 drop-shadow-2xl">
            {locale === 'en' ? '"Sober up, or don\'t. The world ends either way."' : '“清醒过来，或者不。反正世界都会毁灭。”'}
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <button className="bg-black text-[#ccff00] px-12 py-6 font-serif font-black uppercase text-2xl torn-paper hover:bg-[#e3dccb] hover:text-[#8a3324] transition-all hover:scale-105 active:scale-95 shadow-2xl">
              {t.buySteam}
            </button>
            <button className="bg-black text-[#ccff00] px-12 py-6 font-serif font-black uppercase text-2xl torn-paper hover:bg-[#e3dccb] hover:text-[#8a3324] transition-all hover:scale-105 active:scale-95 shadow-2xl">
              {t.buyGog}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-20 text-center border-t-8 border-[#4a4a4a]">
        <div className="mb-10 flex justify-center gap-12 text-[#4a4a4a] text-xs uppercase tracking-[0.4em] font-black">
          <span className="hover:text-[#ccff00] cursor-pointer transition-colors">Bilibili</span>
          <span className="hover:text-[#ccff00] cursor-pointer transition-colors">X / Twitter</span>
          <span className="hover:text-[#ccff00] cursor-pointer transition-colors">Discord</span>
        </div>
        <p className="text-gray-600 text-[10px] leading-relaxed max-w-lg mx-auto italic font-serif px-4">
          {t.footerText}
          <br /><br />
          FOR THE FAILURES. FOR THE FRAGMENTS. FOR THE CITY.
        </p>
      </footer>
    </div>
  );
};

export default App;
