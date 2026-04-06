'use client';

import { useBook } from '@/lib/book-context';
import { DEFAULT_COLOR_SCHEMES, COVER_FONTS, CoverTemplateId } from '@/lib/types';
import { TemplateSelector } from './template-selector';
import { CoverPreview } from './cover-preview';

export function CoverEditor() {
  const { book, dispatch } = useBook();

  const colorSchemes = Object.entries(DEFAULT_COLOR_SCHEMES);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-8">
        {/* Template Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">표지 템플릿</h3>
          <TemplateSelector
            selected={book.cover.templateId}
            onSelect={(id: CoverTemplateId) => dispatch({ type: 'SET_COVER', payload: { templateId: id } })}
          />
        </div>

        {/* Color Scheme */}
        <div>
          <h3 className="text-lg font-semibold mb-4">색상 테마</h3>
          <div className="flex flex-wrap gap-3">
            {colorSchemes.map(([name, scheme]) => (
              <button
                key={name}
                onClick={() => dispatch({ type: 'SET_COVER', payload: { colorScheme: scheme } })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  book.cover.colorScheme.primary === scheme.primary
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ background: scheme.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: scheme.secondary }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: scheme.accent }} />
                </div>
                <span className="text-sm capitalize text-zinc-300">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">폰트</h3>
          <div className="flex flex-wrap gap-2">
            {COVER_FONTS.map((font) => (
              <button
                key={font}
                onClick={() => dispatch({ type: 'SET_COVER', payload: { fontFamily: font } })}
                className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                  book.cover.fontFamily === font
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Title / Subtitle Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">제목</label>
            <input
              type="text"
              value={book.title}
              onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
              placeholder="eBook 제목"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">부제목</label>
            <input
              type="text"
              value={book.subtitle}
              onChange={(e) => dispatch({ type: 'SET_SUBTITLE', payload: e.target.value })}
              placeholder="부제목"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">저자명</label>
            <input
              type="text"
              value={book.author.name}
              onChange={(e) => dispatch({ type: 'SET_AUTHOR', payload: { name: e.target.value } })}
              placeholder="저자 이름"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-8 self-start">
        <h3 className="text-lg font-semibold mb-4">실시간 미리보기</h3>
        <div className="max-w-sm mx-auto">
          <CoverPreview
            title={book.title}
            subtitle={book.subtitle}
            authorName={book.author.name}
            cover={book.cover}
          />
        </div>
      </div>
    </div>
  );
}
