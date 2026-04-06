'use client';

import { useState } from 'react';
import { useBook } from '@/lib/book-context';
import { generateChapters, getAllCategories } from '@/lib/templates/content-templates';
import { ChapterLength } from '@/lib/types';

export function ContentGenerator() {
  const { book, dispatch } = useBook();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLength, setSelectedLength] = useState<ChapterLength>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = getAllCategories();

  const handleGenerate = async () => {
    if (!selectedCategory) return;
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((r) => setTimeout(r, 1500));

    const chapters = generateChapters(selectedCategory, selectedLength);
    chapters.forEach((chapter) => {
      dispatch({ type: 'ADD_CHAPTER', payload: chapter });
    });

    if (!book.title) {
      dispatch({ type: 'SET_TITLE', payload: `${selectedCategory} 완벽 가이드` });
    }

    setIsGenerating(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-500/20 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-1">AI 콘텐츠 자동 생성</h3>
      <p className="text-sm text-zinc-400 mb-6">주제를 선택하면 챕터와 내용을 자동으로 생성합니다</p>

      <div className="space-y-4">
        {/* Category selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">주제 카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Length selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">챕터 분량</label>
          <div className="flex gap-2">
            {([
              { value: 'short' as const, label: '짧게 (2-3단락)', desc: '핵심만 간결하게' },
              { value: 'medium' as const, label: '보통 (5-7단락)', desc: '적절한 깊이' },
              { value: 'long' as const, label: '길게 (8+단락)', desc: '상세한 분석' },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedLength(opt.value)}
                className={`flex-1 p-3 rounded-xl text-left transition-all ${
                  selectedLength === opt.value
                    ? 'bg-indigo-600/20 border border-indigo-500/50'
                    : 'bg-zinc-800/50 border border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="text-sm font-medium text-white">{opt.label}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedCategory || isGenerating}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              생성 중...
            </>
          ) : (
            '챕터 자동 생성'
          )}
        </button>

        {book.chapters.length > 0 && (
          <p className="text-xs text-zinc-500 text-center">
            현재 {book.chapters.length}개 챕터가 있습니다. 새로 생성하면 추가됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
