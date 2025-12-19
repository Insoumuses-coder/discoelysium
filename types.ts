
export enum SkillType {
  INTELLECT = 'Intellect',
  PSYCHE = 'Psyche',
  PHYSIQUE = 'Physique',
  MOTORICS = 'Motorics'
}

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
