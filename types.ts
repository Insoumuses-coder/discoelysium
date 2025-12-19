
export enum SkillType {
  INTELLECT = 'Intellect',
  PSYCHE = 'Psyche',
  PHYSIQUE = 'Physique',
  MOTORICS = 'Motorics'
}

export type Locale = 'en' | 'zh';

export interface Skill {
  name: string;
  type: SkillType;
  description: string;
  level: number;
}

export interface DialoguePart {
  speaker: string;
  text: string;
  type: 'system' | 'user' | 'skill';
  skillName?: string;
}

export interface Suspect {
  name: string;
  description: string;
  background: string;
  image: string;
}

export interface TranslationSet {
  subtitle: string;
  caseFileHeader: string;
  caseFileContent: string;
  thoughtCabinetTitle: string;
  skillsTitle: string;
  buySteam: string;
  buyGog: string;
  footerText: string;
  themeNocturnal: string;
  themeDiurnal: string;
}
