'use client';

import { CoverTemplateId, DEFAULT_COLOR_SCHEMES } from '@/lib/types';
import { COVER_TEMPLATES } from './templates';
import { CoverPreview } from './cover-preview';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selected: CoverTemplateId;
  onSelect: (id: CoverTemplateId) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
      {COVER_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            'text-left rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03]',
            selected === template.id
              ? 'border-primary ring-2 ring-primary/30'
              : 'border-border hover:border-muted-foreground'
          )}
        >
          <div className="w-full">
            <CoverPreview
              title="샘플 제목"
              subtitle="부제목 예시"
              authorName="저자명"
              cover={{ templateId: template.id, colorScheme: DEFAULT_COLOR_SCHEMES.ocean, fontFamily: 'Pretendard' }}
              compact
            />
          </div>
          <div className="p-2 bg-card">
            <div className="text-xs font-medium">{template.nameKo}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
