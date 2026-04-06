'use client';

import { CoverConfig } from '@/lib/types';

interface CoverPreviewProps {
  title: string;
  subtitle: string;
  authorName: string;
  cover: CoverConfig;
  className?: string;
}

export function CoverPreview({ title, subtitle, authorName, cover, className = '' }: CoverPreviewProps) {
  const { colorScheme, templateId, fontFamily } = cover;
  const displayTitle = title || '제목을 입력하세요';
  const displaySubtitle = subtitle || '부제목';
  const displayAuthor = authorName || '저자명';

  const templates: Record<string, () => React.ReactNode> = {
    modern: () => (
      <div
        className="w-full h-full flex flex-col justify-between p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})`, fontFamily }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: colorScheme.accent, filter: 'blur(40px)' }} />
        <div className="absolute bottom-10 left-5 w-32 h-32 rounded-full opacity-15" style={{ background: colorScheme.accent, filter: 'blur(30px)' }} />
        <div>
          <div className="w-12 h-1 mb-6" style={{ background: colorScheme.accent }} />
          <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className="text-base opacity-80" style={{ color: colorScheme.text }}>{displaySubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: colorScheme.accent, color: colorScheme.background }}>
            {displayAuthor.charAt(0)}
          </div>
          <span className="text-sm font-medium" style={{ color: colorScheme.text }}>{displayAuthor}</span>
        </div>
      </div>
    ),
    classic: () => (
      <div
        className="w-full h-full flex flex-col justify-center items-center p-8 text-center"
        style={{ background: colorScheme.background, fontFamily }}
      >
        <div className="w-24 h-0.5 mb-6" style={{ background: colorScheme.primary }} />
        <h1 className="text-3xl font-serif font-bold leading-tight mb-3" style={{ color: colorScheme.text }}>{displayTitle}</h1>
        <div className="w-16 h-0.5 my-4" style={{ background: colorScheme.primary }} />
        <p className="text-base italic opacity-80 mb-6" style={{ color: colorScheme.text }}>{displaySubtitle}</p>
        <div className="w-24 h-0.5 mb-4" style={{ background: colorScheme.primary }} />
        <span className="text-sm tracking-widest uppercase" style={{ color: colorScheme.primary }}>{displayAuthor}</span>
      </div>
    ),
    minimalist: () => (
      <div
        className="w-full h-full flex flex-col justify-end p-10"
        style={{ background: colorScheme.background, fontFamily }}
      >
        <h1 className="text-4xl font-light leading-tight mb-2" style={{ color: colorScheme.text }}>{displayTitle}</h1>
        <p className="text-sm opacity-60 mb-8" style={{ color: colorScheme.text }}>{displaySubtitle}</p>
        <span className="text-xs tracking-wider uppercase opacity-50" style={{ color: colorScheme.text }}>{displayAuthor}</span>
      </div>
    ),
    bold: () => (
      <div
        className="w-full h-full flex flex-col justify-center p-8 relative overflow-hidden"
        style={{ background: colorScheme.background, fontFamily }}
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(45deg, ${colorScheme.primary}40, transparent)` }} />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded mb-4" style={{ background: colorScheme.primary, color: colorScheme.text }}>
            eBook
          </span>
          <h1 className="text-4xl font-black leading-none mb-4" style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className="text-base font-medium opacity-70 mb-6" style={{ color: colorScheme.text }}>{displaySubtitle}</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5" style={{ background: colorScheme.accent }} />
            <span className="text-sm font-bold" style={{ color: colorScheme.accent }}>{displayAuthor}</span>
          </div>
        </div>
      </div>
    ),
    academic: () => (
      <div
        className="w-full h-full flex flex-col p-8 border-4"
        style={{ background: colorScheme.background, borderColor: colorScheme.primary, fontFamily }}
      >
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6" style={{ border: `2px solid ${colorScheme.primary}`, color: colorScheme.primary }}>
            A
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-3" style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className="text-sm opacity-70 mb-4" style={{ color: colorScheme.text }}>{displaySubtitle}</p>
        </div>
        <div className="text-center border-t pt-4" style={{ borderColor: colorScheme.primary }}>
          <span className="text-sm" style={{ color: colorScheme.primary }}>{displayAuthor}</span>
          <p className="text-xs opacity-50 mt-1" style={{ color: colorScheme.text }}>2026</p>
        </div>
      </div>
    ),
  };

  const renderTemplate = templates[templateId] || templates.modern;

  return (
    <div className={`aspect-[3/4] rounded-lg overflow-hidden shadow-2xl ${className}`}>
      {renderTemplate()}
    </div>
  );
}
