
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { SYSTEM_PROMPTS } from '../constants';
import { DialoguePart, Locale } from '../types';

interface ThoughtCabinetProps {
  locale: Locale;
}

const ThoughtCabinet: React.FC<ThoughtCabinetProps> = ({ locale }) => {
  const [messages, setMessages] = useState<DialoguePart[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { 
        speaker: 'System', 
        text: locale === 'zh' ? "你的大脑里挤满了人。有人在敲门。" : "Your brain is a crowded room. Someone is knocking.", 
        type: 'system' 
      }
    ]);
  }, [locale]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: DialoguePart = { speaker: locale === 'zh' ? '侦探' : 'Detective', text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const prompt = `User Thought: "${input}"`;
    const response = await geminiService.generateDialogue(prompt, SYSTEM_PROMPTS.THOUGHT_CABINET(locale));
    
    const skillMatch = response.match(/^([^:]+):/);
    const skillName = skillMatch ? skillMatch[1].trim() : (locale === 'zh' ? '内陆帝国' : 'Inland Empire');
    const cleanText = skillMatch ? response.replace(skillMatch[0], '').trim() : response;

    setMessages(prev => [...prev, {
      speaker: skillName,
      text: cleanText,
      type: 'skill',
      skillName: skillName
    }]);
    setLoading(false);
  };

  return (
    <div className="w-full bg-black/40 border border-[#4a4a4a] p-4 md:p-8 relative backdrop-blur-sm">
      <div className="absolute top-0 right-0 bg-[#8a3324] text-[#e3dccb] px-4 py-1 text-[10px] uppercase tracking-tighter">
        Thought Cabinet v4.12
      </div>
      
      <div 
        ref={scrollRef}
        className="h-[400px] overflow-y-auto mb-6 pr-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}>
            <span className={`text-[10px] uppercase font-bold mb-1 tracking-[0.2em] ${
              m.type === 'skill' ? 'text-[#ccff00]' : m.type === 'user' ? 'text-[#8a3324]' : 'text-gray-500'
            }`}>
              {m.speaker}
            </span>
            <div className={`p-4 max-w-[90%] transition-all ${
              m.type === 'skill' 
                ? 'bg-[#111] text-[#e3dccb] italic border-l-2 border-[#ccff00] shadow-[inset_0_0_20px_rgba(204,255,0,0.05)]' 
                : m.type === 'user'
                ? 'bg-[#8a3324] text-[#e3dccb] italic font-serif'
                : 'text-gray-500 italic text-sm border border-dashed border-gray-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-[#ccff00] text-xs uppercase italic animate-pulse">
            <span className="w-2 h-2 bg-[#ccff00] rounded-full" />
            {locale === 'zh' ? '神经通路放电中...' : 'Neural pathways firing...'}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={locale === 'zh' ? "输入你的想法..." : "Input a thought..."}
          className="w-full bg-transparent border-b border-[#4a4a4a] focus:border-[#ccff00] transition-colors outline-none py-4 px-2 text-[#e3dccb] placeholder-gray-600 font-serif italic text-lg"
          disabled={loading}
        />
        <button 
          type="submit"
          className="absolute right-0 bottom-4 text-[#ccff00] hover:scale-125 transition-transform disabled:opacity-50"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ThoughtCabinet;
