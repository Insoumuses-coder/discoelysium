
import { SkillType, Skill, Suspect } from './types';

export const COLORS = {
  RUST: '#8a3324',
  ACID: '#ccff00',
  DARK: '#1a1a1a',
  PAPER: '#e3dccb',
  GREY: '#4a4a4a'
};

export const DEFAULT_SKILLS: Skill[] = [
  { name: 'Logic', type: SkillType.INTELLECT, level: 5, description: 'Deduce the sequence of events.' },
  { name: 'Inland Empire', type: SkillType.PSYCHE, level: 8, description: 'The world of dreams and inanimate conversations.' },
  { name: 'Half Light', type: SkillType.PHYSIQUE, level: 4, description: 'The raw, animalistic fear and aggression.' },
  { name: 'Reaction Speed', type: SkillType.MOTORICS, level: 6, description: 'Dodge bullets. Or sharp words.' }
];

export const SUSPECTS: Suspect[] = [
  {
    name: 'Klaasje (The Dancer)',
    description: 'A mysterious woman smoking on a balcony.',
    background: 'She claims to be a corporate refugee, but her eyes suggest she knows more about the hanging man than she lets on.',
    image: 'https://picsum.photos/seed/klaasje/400/500'
  },
  {
    name: 'The Cuno',
    description: 'A foul-mouthed street urchin.',
    background: 'He is throwing rocks at the body. He doesn\'t care about your badge or your sobriety.',
    image: 'https://picsum.photos/seed/cuno/400/500'
  }
];

export const SYSTEM_PROMPTS = {
  THOUGHT_CABINET: `You are the "Inner Voice" skills of a detective in the world of Disco Elysium. 
  When the user expresses a thought, pick ONE of the 24 skills (e.g., Logic, Inland Empire, Electrochemistry, Rhetoric, Shivers) 
  to respond in the distinct, grimy, poetic, and philosophical tone of the game. 
  The response should be cynical, weird, and deeply evocative. Use noir metaphors.`,
  
  INTERROGATION: (suspect: Suspect) => `You are ${suspect.name}. ${suspect.description} 
  Background: ${suspect.background}. 
  The user is a mess of a detective trying to solve a murder. 
  Respond in the style of Disco Elysium dialogue. Be elusive, defensive, or aggressive depending on how the detective speaks. 
  Never break character.`
};
