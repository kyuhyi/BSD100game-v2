import { CoverTemplateId, ColorScheme } from '@/lib/types';

export interface CoverTemplateProps {
  title: string;
  subtitle: string;
  authorName: string;
  colorScheme: ColorScheme;
  fontFamily: string;
}

export interface CoverTemplateInfo {
  id: CoverTemplateId;
  name: string;
  nameKo: string;
  description: string;
}

export const COVER_TEMPLATES: CoverTemplateInfo[] = [
  { id: 'modern', name: 'Modern', nameKo: '모던', description: '깔끔한 그라데이션과 대담한 타이포그래피' },
  { id: 'classic', name: 'Classic', nameKo: '클래식', description: '전통적이고 우아한 레이아웃' },
  { id: 'minimalist', name: 'Minimalist', nameKo: '미니멀', description: '여백을 활용한 심플한 디자인' },
  { id: 'bold', name: 'Bold', nameKo: '볼드', description: '강렬한 색상과 큰 글씨' },
  { id: 'academic', name: 'Academic', nameKo: '아카데믹', description: '학술적이고 신뢰감 있는 스타일' },
];
