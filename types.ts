
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

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  thumbnail: string;
  downloadUrl?: string; // Made optional to support toggleable fields
  youtubeId?: string;
  driveUrl?: string;
  getKeyUrl?: string;
  createdAt?: number;
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
