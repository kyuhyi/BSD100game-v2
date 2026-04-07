'use client';

import { CoverConfig } from '@/lib/types';

interface CoverPreviewProps {
  title: string;
  subtitle: string;
  authorName: string;
  cover: CoverConfig;
  className?: string;
  compact?: boolean;
}

export function CoverPreview({ title, subtitle, authorName, cover, className = '', compact = false }: CoverPreviewProps) {
  const { colorScheme, templateId, fontFamily, customImage } = cover;
  const displayTitle = title || '제목을 입력하세요';
  const displaySubtitle = subtitle || '부제목';
  const displayAuthor = authorName || '저자명';

  const titleSize = compact ? 'text-sm' : 'text-2xl';
  const subtitleSize = compact ? 'text-[10px]' : 'text-sm';
  const authorSize = compact ? 'text-[10px]' : 'text-xs';
  const padSize = compact ? 'p-4' : 'p-8';
  const smallPad = compact ? 'p-3' : 'p-6';

  const bgImage = customImage ? {
    backgroundImage: `url(${customImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  const overlay = customImage ? 'bg-black/50' : '';

  const templates: Record<string, () => React.ReactNode> = {
    modern: () => (
      <div
        className={`w-full h-full flex flex-col justify-between ${padSize} relative overflow-hidden`}
        style={{ background: customImage ? undefined : `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})`, fontFamily, ...bgImage }}
      >
        {customImage && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />}
        <div className="relative z-10">
          <div className={`${compact ? 'w-6 h-0.5 mb-3' : 'w-12 h-1 mb-6'}`} style={{ background: colorScheme.accent }} />
          <h1 className={`${titleSize} font-bold leading-tight mb-1`} style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className={`${subtitleSize} opacity-80 mt-1`} style={{ color: colorScheme.text }}>{displaySubtitle}</p>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <div className={`${compact ? 'w-5 h-5 text-[8px]' : 'w-8 h-8 text-xs'} rounded-full flex items-center justify-center font-bold`} style={{ background: colorScheme.accent, color: colorScheme.background }}>
            {displayAuthor.charAt(0)}
          </div>
          <span className={`${authorSize} font-medium`} style={{ color: colorScheme.text }}>{displayAuthor}</span>
        </div>
      </div>
    ),

    classic: () => (
      <div
        className={`w-full h-full flex flex-col justify-center items-center ${padSize} text-center relative`}
        style={{ background: customImage ? undefined : colorScheme.background, fontFamily, ...bgImage }}
      >
        {customImage && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`${compact ? 'w-12 h-px mb-3' : 'w-20 h-px mb-6'}`} style={{ background: colorScheme.primary }} />
          <div className={`${compact ? 'w-8 h-px mb-3' : 'w-12 h-px mb-4'}`} style={{ background: colorScheme.primary }} />
          <h1 className={`${titleSize} font-serif font-bold leading-tight mb-2`} style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <div className={`${compact ? 'w-8 h-px my-2' : 'w-12 h-px my-3'}`} style={{ background: colorScheme.primary }} />
          <p className={`${subtitleSize} italic opacity-70 mb-3`} style={{ color: colorScheme.text }}>{displaySubtitle}</p>
          <div className={`${compact ? 'w-12 h-px mb-2' : 'w-20 h-px mb-3'}`} style={{ background: colorScheme.primary }} />
          <span className={`${authorSize} tracking-[0.2em] uppercase`} style={{ color: colorScheme.primary }}>{displayAuthor}</span>
        </div>
      </div>
    ),

    minimalist: () => (
      <div
        className={`w-full h-full flex flex-col justify-end ${smallPad} relative`}
        style={{ background: customImage ? undefined : colorScheme.background, fontFamily, ...bgImage }}
      >
        {customImage && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />}
        <div className="relative z-10">
          <h1 className={`${compact ? 'text-base' : 'text-3xl'} font-light leading-tight mb-1`} style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className={`${subtitleSize} opacity-50 mb-4`} style={{ color: colorScheme.text }}>{displaySubtitle}</p>
          <span className={`${authorSize} tracking-wider uppercase opacity-40`} style={{ color: colorScheme.text }}>{displayAuthor}</span>
        </div>
      </div>
    ),

    bold: () => (
      <div
        className={`w-full h-full flex flex-col justify-center ${padSize} relative overflow-hidden`}
        style={{ background: customImage ? undefined : colorScheme.background, fontFamily, ...bgImage }}
      >
        {customImage && <div className="absolute inset-0 bg-black/40" />}
        {!customImage && <div className="absolute inset-0" style={{ background: `linear-gradient(45deg, ${colorScheme.primary}40, transparent)` }} />}
        <div className="relative z-10">
          <span className={`inline-block ${compact ? 'px-1.5 py-0.5 text-[8px]' : 'px-3 py-1 text-xs'} font-bold uppercase tracking-wider rounded mb-3`} style={{ background: colorScheme.primary, color: colorScheme.text }}>
            EBOOK
          </span>
          <h1 className={`${compact ? 'text-base' : 'text-3xl'} font-black leading-none mb-2`} style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className={`${subtitleSize} font-medium opacity-60 mb-4`} style={{ color: colorScheme.text }}>{displaySubtitle}</p>
          <div className="flex items-center gap-2">
            <div className={`${compact ? 'w-4 h-px' : 'w-8 h-px'}`} style={{ background: colorScheme.accent }} />
            <span className={`${authorSize} font-bold`} style={{ color: colorScheme.accent }}>{displayAuthor}</span>
          </div>
        </div>
      </div>
    ),

    academic: () => (
      <div
        className={`w-full h-full flex flex-col ${compact ? 'p-3 border-2' : 'p-6 border-[3px]'} relative`}
        style={{ background: customImage ? undefined : colorScheme.background, borderColor: colorScheme.primary, fontFamily, ...bgImage }}
      >
        {customImage && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-2">
          <div className={`${compact ? 'w-8 h-8 text-sm mb-3' : 'w-14 h-14 text-xl mb-5'} rounded-full flex items-center justify-center`} style={{ border: `2px solid ${colorScheme.primary}`, color: colorScheme.primary }}>
            A
          </div>
          <h1 className={`${compact ? 'text-xs' : 'text-xl'} font-bold leading-tight mb-2`} style={{ color: colorScheme.text }}>{displayTitle}</h1>
          <p className={`${subtitleSize} opacity-60 mb-2`} style={{ color: colorScheme.text }}>{displaySubtitle}</p>
        </div>
        <div className="relative z-10 text-center border-t pt-2" style={{ borderColor: colorScheme.primary }}>
          <span className={`${authorSize}`} style={{ color: colorScheme.primary }}>{displayAuthor}</span>
          <p className={`${compact ? 'text-[8px]' : 'text-[10px]'} opacity-40 mt-0.5`} style={{ color: colorScheme.text }}>2026</p>
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
