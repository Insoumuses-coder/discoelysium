
import { SkillType, Skill, Locale, TranslationSet } from './types';

export const COLORS = {
  RUST: '#8a3324',
  ACID: '#ccff00',
  DARK: '#1a1a1a',
  PAPER: '#e3dccb',
  GREY: '#4a4a4a'
};

export const DEFAULT_SKILLS: Skill[] = [
  { name: 'Logic', type: SkillType.INTELLECT, level: 8, description: 'Deduce the sequence of events. Rule over your internal world.' },
  { name: 'Inland Empire', type: SkillType.PSYCHE, level: 9, description: 'The world of dreams and inanimate conversations. Your tie is screaming.' },
  { name: 'Half Light', type: SkillType.PHYSIQUE, level: 4, description: 'Raw, animalistic fear. The darkness is breathing, detective.' },
  { name: 'Drama', type: SkillType.MOTORICS, level: 7, description: 'The stage is yours. Perform or be found out, sire.' },
  { name: 'Electrochemistry', type: SkillType.PHYSIQUE, level: 6, description: 'The party never stops in your blood. One more drink?' },
  { name: 'Shivers', type: SkillType.PSYCHE, level: 5, description: 'The city talks to you. A cold wind blows from the harbor.' }
];

export const I18N: Record<Locale, TranslationSet> = {
  en: {
    subtitle: '"Get wasted or get detecting. The city just wants you quiet."',
    caseFileHeader: 'Case File #412: The Hangman',
    caseFileContent: 'You wake up in a hotel room, hungover and amnesiac. Outside is Revachol—a city on the edge of collapse. Will you become a hero detective, or a catastrophic drunk? Your mind is your only weapon.',
    thoughtCabinetTitle: 'Internal Dialogue Simulator',
    skillsTitle: 'The Voices in Your Head',
    buySteam: 'Buy on Steam',
    buyGog: 'Buy on GOG',
    footerText: '© 2025 ZA/UM. Dedicated to the failures and the broken world.',
    themeNocturnal: 'NOCTURNAL',
    themeDiurnal: 'DIURNAL'
  },
  zh: {
    subtitle: '“醉倒或侦探。这座城市只想让你沉默。”',
    caseFileHeader: '案件档案 #412：吊人',
    caseFileContent: '你在旅馆房间醒来，宿醉未消，记忆全无。外面是瑞瓦肖——一座处于崩溃边缘的城市。你是要成为一名英雄侦探，还是彻底沦为一个酒鬼灾难？在这个灰暗的世界里，你的思想是你唯一的武器。',
    thoughtCabinetTitle: '思维阁：内心对话模拟器',
    skillsTitle: '你脑海中的24种声音',
    buySteam: 'Steam 购买',
    buyGog: 'GOG 购买',
    footerText: '© 2025 ZA/UM. 谨以此献给失败者与破碎的世界。',
    themeNocturnal: '深夜模式',
    themeDiurnal: '白昼模式'
  }
};

export const SYSTEM_PROMPTS = {
  THOUGHT_CABINET: (locale: Locale) => `You are the "Inner Voice" skills of a detective in the world of Disco Elysium. 
  Pick ONE of the 24 skills (e.g., Logic, Inland Empire, Electrochemistry, Rhetoric, Shivers) to respond.
  Tone: Grimy, poetic, philosophical, cynical, evocative. Use noir metaphors.
  MANDATORY: Respond strictly in ${locale === 'zh' ? 'Chinese (Simplified)' : 'English'}.
  Format: "Skill Name: Response Text"`
};
