export type ArtStyle = 
  | 'retro-comic' 
  | 'manga' 
  | 'dark-noir' 
  | 'cyberpunk' 
  | 'vintage-pulp'
  | 'watercolor-indie';

export type LayoutMode = 'classic-4' | 'grid-6' | 'hero-splash' | 'cinematic-3' | 'webtoon-vertical';

export type BubbleType = 'speech' | 'thought' | 'shout' | 'whisper' | 'caption';

export type BubblePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'top-center' | 'bottom-center';

export interface DialogueItem {
  id: string;
  speaker: string;
  text: string;
  type: BubbleType;
  position: BubblePosition;
  characterColor?: string;
}

export interface SoundEffectItem {
  id: string;
  text: string;
  style: 'punchy' | 'fiery' | 'electric' | 'cosmic' | 'stealth';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number; // degrees
  scale?: number;
}

export interface PanelIllustrationData {
  primarySubject: string;
  actionPose: string;
  environment: string;
  colorPalette: {
    skyOrBg: string;
    groundOrMid: string;
    accent: string;
    shadow: string;
  };
  lightingMood: string;
  effects: ('speed-lines' | 'halftone-dots' | 'energy-burst' | 'smoke' | 'rain' | 'sunburst')[];
  compositionAngle: string;
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  caption?: string; // Narrator caption box
  visualDescription: string;
  cameraAngle: string;
  imageUrl?: string; // Generated image or custom uploaded data URI
  illustrationData: PanelIllustrationData;
  dialogue: DialogueItem[];
  soundEffects: SoundEffectItem[];
  aspectRatio?: 'standard' | 'wide' | 'tall';
}

export interface ComicCharacter {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'sidekick' | 'mentor' | 'extra';
  appearance: string;
  personality: string;
  colorTheme: string;
  avatarSeed?: string;
}

export interface ComicStory {
  id: string;
  title: string;
  issueNumber: string;
  tagline: string;
  genre: string;
  tone: string;
  artStyle: ArtStyle;
  layout: LayoutMode;
  createdAt: string;
  author: string;
  synopsis: string;
  characters: ComicCharacter[];
  panels: ComicPanel[];
  coverColor?: string;
}

export interface StoryGenerationRequest {
  prompt: string;
  genre: string;
  tone: string;
  artStyle: ArtStyle;
  panelCount: number;
  layout: LayoutMode;
  characters?: { name: string; role: string; description: string }[];
}
