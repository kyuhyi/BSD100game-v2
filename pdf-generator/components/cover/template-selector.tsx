'use client';

import { CoverTemplateId, DEFAULT_COLOR_SCHEMES } from '@/lib/types';
import { COVER_TEMPLATES } from './templates';
import { CoverPreview } from './cover-preview';

interface TemplateSelectorProps {
  selected: CoverTemplateId;
  onSelect: (id: CoverTemplateId) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {COVER_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`text-left rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
            selected === template.id
              ? 'border-indigo-500 ring-2 ring-indigo-500/30'
              : 'border-zinc-700 hover:border-zinc-500'
          }`}
        >
          <div className="w-full h-48">
            <CoverPreview
              title="샘플 제목"
              subtitle="부제목 예시"
              authorName="저자명"
              cover={{
                templateId: template.id,
                colorScheme: DEFAULT_COLOR_SCHEMES.ocean,
                fontFamily: 'Pretendard',
              }}
            />
          </div>
          <div className="p-3 bg-zinc-900">
            <div className="text-sm font-medium text-white">{template.nameKo}</div>
            <div className="text-xs text-zinc-400">{template.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
