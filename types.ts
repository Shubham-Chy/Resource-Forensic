export enum ResourceCategory {
  SOFTWARE = 'Software',
  PLUGINS = 'Plugins',
  SCRIPTS = 'Scripts',
  EXTENSIONS = 'Extensions',
  TEMPLATES = 'Templates',
  PACKS = 'Packs',
  LEAKS = 'Leaks',
  ANIME_CLIPS = 'Anime Clips'
}

export const CATEGORY_JP: Record<string, string> = {
  'Software': 'ソフトウェア',
  'Plugins': 'プラグイン',
  'Scripts': 'スクリプト',
  'Extensions': '拡張機能',
  'Templates': 'テンプレート',
  'Packs': 'パック',
  'Leaks': 'リーク',
  'Anime Clips': 'アニメクリップ'
};

export interface MirrorLink {
  label: string;
  url: string;
}

export interface Episode {
  id: string;
  number: string;
  name?: string;
  driveLinks: MirrorLink[];
  keyLinks: MirrorLink[];
}

export interface Season {
  id: string;
  label: string;
  episodes: Episode[];
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  thumbnail: string;
  downloadUrl?: string;
  youtubeId?: string;
  driveUrl?: string; // Legacy field
  driveLinks?: MirrorLink[]; // Legacy field for single-entry
  getKeyUrl?: string; // Legacy field
  keyLinks?: MirrorLink[]; // Legacy field for single-entry
  createdAt?: number;
  isUpcoming?: boolean;
  
  // Anime Specific
  isSeasonBased?: boolean;
  seasons?: Season[];
}

export interface CategoryData {
  category: ResourceCategory;
  resources: Resource[];
}

export interface AdminStats {
  totalItems: number;
  byCategory: Record<ResourceCategory, number>;
  uploadHistory: { date: string; count: number }[];
}