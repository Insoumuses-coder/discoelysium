
import React, { useState, useEffect, useMemo } from 'react';
import ThoughtCabinet from './components/ThoughtCabinet';
import SkillCheck from './components/SkillCheck';
import { DEFAULT_SKILLS, I18N } from './constants';
import { Locale } from './types';
import { soundService } from './services/soundService';

// Utility for jittery hand-drawn effect
const jitter = (val: number, amount: number) => val + (Math.random() - 0.5) * amount;

const RoughCircle: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => {
  const generatePath = () => {
    const points = [];
    const segments = 12;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      points.push(`${i === 0 ? 'M' : 'L'} ${jitter(px, 4)} ${jitter(py, 4)}`);
    }
    points.push(`L ${jitter(x + r, 4)} ${jitter(y, 4)}`);
    return points.join(' ');
  };

  return (
    <g>
      <path d={generatePath()} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d={generatePath()} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </g>
  );
};

const RoughArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string }> = ({ x1, y1, x2, y2, color }) => {
  const generateLine = (p1x: number, p1y: number, p2x: number, p2y: number) => {
    const midX = (p1x + p2x) / 2;
    const midY = (p1y + p2y) / 2;
    return `M ${jitter(p1x, 3)} ${jitter(p1y, 3)} Q ${jitter(midX, 10)} ${jitter(midY, 10)} ${jitter(p2x, 3)} ${jitter(p2y, 3)}`;
  };

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 20;
  
  const h1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
  const h1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
  const h2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
  const h2y = y2 - headLen * Math.sin(angle + Math.PI / 6);

  return (
    <g>
      <path d={generateLine(x1, y1, x2, y2)} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d={generateLine(x2, y2, h1x, h1y)} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d={generateLine(x2, y2, h2x, h2y)} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
    </g>
  );
};

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
  const [isMuted, setIsMuted] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const t = I18N[locale];

  useEffect(() => {
    soundService.setMute(isMuted);
  }, [isMuted]);

  const sketches = useMemo(() => {
    return [...Array(3)].map((_, i) => {
      const type = Math.random() > 0.5 ? 'circle' : 'arrow';
      const color = Math.random() > 0.5 ? '#ccff00' : '#8a3324';
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 60 + 20;
      
      if (type === 'circle') {
        return <RoughCircle key={i} x={x * 10} y={y * 10} r={30 + Math.random() * 40} color={color} />;
      } else {
        return <RoughArrow key={i} x1={x * 10} y1={y * 10} x2={x * 10 + (Math.random() - 0.5) * 200} y2={y * 10 + (Math.random() - 0.5) * 200} color={color} />;
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother performance if needed, 
      // but standard listener is fine for this density.
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLocale = () => {
    soundService.playTypewriter();
    setLocale(prev => prev === 'en' ? 'zh' : 'en');
  };
  
  const toggleTheme = () => {
    soundService.playNeonBuzz();
    setTheme(prev => prev === 'night' ? 'day' : 'night');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setTimeout(() => soundService.playTypewriter(), 100);
    }
  };

  // Parallax calculations
  const heroTranslateY = scrollY * 0.5;
  const heroScale = 1 + scrollY * 0.0006;
  const sketchTranslateY = scrollY * 0.2;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      theme === 'night' ? 'bg-[#1a1a1a] text-[#e3dccb]' : 'bg-[#e3dccb] text-[#1a1a1a]'
    }`}>
      {/* PERSISTENT HUD */}
      <div className="fixed top-6 right-6 z-[100] flex gap-4">
        <button 
          onClick={toggleMute}
          onMouseEnter={() => soundService.playTypewriter()}
          className="bg-black/80 text-[#ccff00] border border-[#ccff00] px-3 py-1 text-xs font-bold uppercase hover:bg-[#ccff00] hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center min-w-[40px]"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        <button 
          onClick={toggleLocale}
          onMouseEnter={() => soundService.playTypewriter()}
          className="bg-black/80 text-[#ccff00] border border-[#ccff00] px-3 py-1 text-xs font-bold uppercase hover:bg-[#ccff00] hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
        >
          {locale === 'en' ? 'ZH/EN' : 'EN/中文'}
        </button>
        <button 
          onClick={toggleTheme}
          onMouseEnter={() => soundService.playNeonBuzz()}
          className="bg-black/80 text-[#ccff00] border border-[#ccff00] px-3 py-1 text-xs font-bold uppercase hover:bg-[#ccff00] hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
        >
          {theme === 'night' ? t.themeNocturnal : t.themeDiurnal}
        </button>
      </div>

      {/* HERO SECTION */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden border-b-8 border-current">
        {/* PARALLAX BACKGROUND LAYER */}
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-[filter] duration-1000 ${
            theme === 'night' 
              ? 'grayscale contrast-[1.4] brightness-[0.35]' 
              : 'sepia-[0.6] contrast-[1.1] brightness-[0.75]'
          }`}
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1920&auto=format&fit=crop')",
            transform: `translateY(${heroTranslateY}px) scale(${heroScale})`,
            willChange: 'transform'
          }}
        />
        
        {/* SKETCH OVERLAY (Lighter Parallax) */}
        <svg 
          className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-80"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          style={{ transform: `translateY(${sketchTranslateY}px)`, willChange: 'transform' }}
        >
          {sketches}
        </svg>

        {/* HERO CONTENT */}
        <div className="relative z-10 text-center px-4">
          <h1 
            onMouseEnter={() => soundService.playNeonBuzz()}
            className="text-7xl md:text-[12rem] font-serif font-black tracking-tighter text-transparent italic -rotate-2 neon-flicker pointer-events-none select-none cursor-help drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" 
            style={{ 
              WebkitTextStroke: theme === 'night' ? '2px #ccff00' : '2px #8a3324',
              transform: `translateY(${scrollY * -0.1}px)`
            }}>
            REVACHOL
          </h1>
          <div 
            className="mt-8 bg-black/90 p-6 border border-current shadow-[12px_12px_0_#8a3324] rotate-1 inline-block max-w-xl backdrop-blur-md"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <p className="text-sm md:text-xl italic font-serif text-[#e3dccb]">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* BOTTOM GRADIENT OVERLAY */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
      </header>

      {/* NARRATIVE SECTION */}
      <section className="py-24 px-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
              <div 
                onMouseEnter={() => soundService.playPaperTear()}
                className="bg-[#e3dccb] text-[#1a1a1a] p-10 torn-paper inner-shadow-paper relative group overflow-hidden cursor-default"
              >
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
                <h3 
                  onMouseEnter={() => soundService.playNeonBuzz()}
                  className="text-[#ccff00] uppercase text-xs tracking-[0.4em] font-black mb-6 flex items-center gap-4 cursor-help"
                >
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
              <div 
                key={idx} 
                onMouseEnter={() => soundService.playTypewriter()}
                className={`group relative p-8 border border-current hover:shadow-[10px_10px_0_currentColor] transition-all hover:-translate-y-2 hover:-rotate-1 ${
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
            <button 
              onMouseEnter={() => soundService.playPaperTear()}
              className="bg-black text-[#ccff00] px-12 py-6 font-serif font-black uppercase text-2xl torn-paper hover:bg-[#e3dccb] hover:text-[#8a3324] transition-all hover:scale-105 active:scale-95 shadow-2xl">
              {t.buySteam}
            </button>
            <button 
              onMouseEnter={() => soundService.playPaperTear()}
              className="bg-black text-[#ccff00] px-12 py-6 font-serif font-black uppercase text-2xl torn-paper hover:bg-[#e3dccb] hover:text-[#8a3324] transition-all hover:scale-105 active:scale-95 shadow-2xl">
              {t.buyGog}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-20 text-center border-t-8 border-[#4a4a4a]">
        <div className="mb-10 flex justify-center gap-12 text-[#4a4a4a] text-xs uppercase tracking-[0.4em] font-black">
          <span 
            onMouseEnter={() => soundService.playTypewriter()}
            className="hover:text-[#ccff00] cursor-pointer transition-colors"
          >
            Bilibili
          </span>
          <span 
            onMouseEnter={() => soundService.playTypewriter()}
            className="hover:text-[#ccff00] cursor-pointer transition-colors"
          >
            X / Twitter
          </span>
          <span 
            onMouseEnter={() => soundService.playTypewriter()}
            className="hover:text-[#ccff00] cursor-pointer transition-colors"
          >
            Discord
          </span>
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
