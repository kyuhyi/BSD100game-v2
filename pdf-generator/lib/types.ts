export interface Book {
  id: string;
  title: string;
  subtitle: string;
  cover: CoverConfig;
  chapters: Chapter[];
  author: AuthorProfile;
  createdAt: number;
  updatedAt: number;
}

export interface CoverConfig {
  templateId: CoverTemplateId;
  colorScheme: ColorScheme;
  fontFamily: string;
  customImage?: string;
}

export type CoverTemplateId = 'modern' | 'classic' | 'minimalist' | 'bold' | 'academic';

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  content: string;
  length: ChapterLength;
  visualizations: Visualization[];
  sources: Source[];
}

export type ChapterLength = 'short' | 'medium' | 'long';

export interface Visualization {
  id: string;
  type: VisualizationType;
  data: Record<string, unknown>;
  title: string;
}

export type VisualizationType =
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'comparison-table'
  | 'statistics'
  | 'case-study';

export interface Source {
  id: string;
  title: string;
  author: string;
  url?: string;
  year?: number;
}

export interface AuthorProfile {
  name: string;
  bio: string;
  photo?: string;
  credentials: string[];
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export const COVER_FONTS = [
  'Pretendard',
  'Georgia',
  'Helvetica',
  'Palatino',
  'Garamond',
] as const;

export const DEFAULT_COLOR_SCHEMES: Record<string, ColorScheme> = {
  ocean: {
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#38bdf8',
    background: '#0c4a6e',
    text: '#f0f9ff',
  },
  forest: {
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#4ade80',
    background: '#14532d',
    text: '#f0fdf4',
  },
  sunset: {
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#7c2d12',
    text: '#fff7ed',
  },
  royal: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: '#3b0764',
    text: '#faf5ff',
  },
  midnight: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    accent: '#94a3b8',
    background: '#0f172a',
    text: '#f8fafc',
  },
};
