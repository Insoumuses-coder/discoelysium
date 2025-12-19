
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { SYSTEM_PROMPTS } from '../constants';
import { DialoguePart } from '../types';

const ThoughtCabinet: React.FC = () => {
  const [messages, setMessages] = useState<DialoguePart[]>([
    { speaker: 'System', text: "Your brain is a crowded room. Someone is knocking.", type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: DialoguePart = { speaker: 'Detective', text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const prompt = `User Thought: "${input}"\nRespond as a skill from Disco Elysium.`;
    const response = await geminiService.generateDialogue(prompt, SYSTEM_PROMPTS.THOUGHT_CABINET);
    
    // Attempt to parse skill name if Gemini includes it (e.g. "Logic: ...")
    const skillMatch = response.match(/^(\w+(?:\s\w+)*):/);
    const skillName = skillMatch ? skillMatch[1] : 'Inland Empire';
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
    <div className="w-full max-w-4xl mx-auto bg-[#1a1a1a] border border-[#4a4a4a] p-4 md:p-8 relative">
      <div className="absolute top-0 right-0 bg-[#8a3324] text-[#e3dccb] px-4 py-1 text-xs uppercase tracking-tighter">
        Thought Cabinet v0.42
      </div>
      
      <div 
        ref={scrollRef}
        className="h-96 overflow-y-auto mb-6 pr-4 space-y-6 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'}`}>
            <span className={`text-[10px] uppercase font-bold mb-1 tracking-widest ${
              m.type === 'skill' ? 'text-[#ccff00]' : m.type === 'user' ? 'text-[#8a3324]' : 'text-gray-500'
            }`}>
              {m.speaker}
            </span>
            <div className={`p-4 max-w-[85%] ${
              m.type === 'skill' 
                ? 'bg-[#222] text-[#e3dccb] italic border-l-4 border-[#ccff00]' 
                : m.type === 'user'
                ? 'bg-[#8a3324] text-[#e3dccb] italic'
                : 'text-gray-500 italic text-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="animate-pulse text-[#ccff00] text-xs uppercase italic">
            Neural pathways firing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Input a thought or observation..."
          className="w-full bg-transparent border-b-2 border-[#4a4a4a] focus:border-[#ccff00] outline-none py-3 px-2 text-[#e3dccb] placeholder-gray-600 font-serif italic text-lg"
          disabled={loading}
        />
        <button 
          type="submit"
          className="absolute right-0 bottom-3 text-[#ccff00] hover:scale-110 transition-transform disabled:opacity-50"
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
