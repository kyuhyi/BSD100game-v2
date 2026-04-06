'use client';

import { useBook } from '@/lib/book-context';
import { Chapter } from '@/lib/types';
import Link from 'next/link';

interface ChapterListProps {
  onSelectChapter?: (id: string) => void;
}

export function ChapterList({ onSelectChapter }: ChapterListProps) {
  const { book, dispatch } = useBook();

  const addChapter = () => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: `챕터 ${book.chapters.length + 1}`,
      order: book.chapters.length,
      content: '',
      length: 'medium',
      visualizations: [],
      sources: [],
    };
    dispatch({ type: 'ADD_CHAPTER', payload: newChapter });
  };

  const removeChapter = (id: string) => {
    dispatch({ type: 'REMOVE_CHAPTER', payload: id });
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...book.chapters];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newChapters.length) return;
    [newChapters[index], newChapters[swapIndex]] = [newChapters[swapIndex], newChapters[index]];
    newChapters.forEach((ch, i) => (ch.order = i));
    dispatch({ type: 'REORDER_CHAPTERS', payload: newChapters });
  };

  return (
    <div className="space-y-3">
      {book.chapters.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-lg mb-2">아직 챕터가 없습니다</p>
          <p className="text-sm">챕터를 추가하거나 AI 자동 생성을 사용하세요</p>
        </div>
      ) : (
        book.chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group"
          >
            {/* Order controls */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveChapter(index, 'up')}
                disabled={index === 0}
                className="text-zinc-500 hover:text-white disabled:opacity-20 text-xs"
              >
                ▲
              </button>
              <button
                onClick={() => moveChapter(index, 'down')}
                disabled={index === book.chapters.length - 1}
                className="text-zinc-500 hover:text-white disabled:opacity-20 text-xs"
              >
                ▼
              </button>
            </div>

            {/* Chapter number */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-sm font-bold shrink-0">
              {index + 1}
            </div>

            {/* Chapter info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{chapter.title}</div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {{ short: '짧게', medium: '보통', long: '길게' }[chapter.length]} ·{' '}
                {chapter.content ? `${chapter.content.length}자` : '내용 없음'} ·{' '}
                {chapter.visualizations.length}개 시각화
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/create/chapters/${chapter.id}`}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-all"
              >
                편집
              </Link>
              <button
                onClick={() => removeChapter(chapter.id)}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs rounded-lg transition-all"
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}

      {/* Add chapter button */}
      <button
        onClick={addChapter}
        className="w-full py-3 border-2 border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-500 hover:text-indigo-400 rounded-xl transition-all text-sm font-medium"
      >
        + 새 챕터 추가
      </button>
    </div>
  );
}
