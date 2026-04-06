'use client';

import { useState } from 'react';
import { useBook } from '@/lib/book-context';
import { ChapterLength } from '@/lib/types';

interface ChapterEditorProps {
  chapterId: string;
}

export function ChapterEditor({ chapterId }: ChapterEditorProps) {
  const { book, dispatch } = useBook();
  const chapter = book.chapters.find((c) => c.id === chapterId);

  if (!chapter) {
    return <div className="text-zinc-500">챕터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Chapter title */}
      <input
        type="text"
        value={chapter.title}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_CHAPTER', payload: { id: chapterId, updates: { title: e.target.value } } })
        }
        className="w-full text-2xl font-bold bg-transparent border-b border-zinc-700 pb-2 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
        placeholder="챕터 제목"
      />

      {/* Length selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">분량:</span>
        {(['short', 'medium', 'long'] as ChapterLength[]).map((len) => (
          <button
            key={len}
            onClick={() =>
              dispatch({ type: 'UPDATE_CHAPTER', payload: { id: chapterId, updates: { length: len } } })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chapter.length === len
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {{ short: '짧게', medium: '보통', long: '길게' }[len]}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-zinc-900 border border-zinc-700 rounded-xl">
        {[
          { label: 'B', style: 'font-bold' },
          { label: 'I', style: 'italic' },
          { label: 'H1', style: 'text-xs' },
          { label: 'H2', style: 'text-xs' },
          { label: '""', style: 'text-xs' },
          { label: '• List', style: 'text-xs' },
        ].map((btn) => (
          <button
            key={btn.label}
            className={`px-3 py-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all text-sm ${btn.style}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Content Editor (textarea as TipTap fallback) */}
      <textarea
        value={chapter.content}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_CHAPTER', payload: { id: chapterId, updates: { content: e.target.value } } })
        }
        className="w-full min-h-[400px] p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all resize-y leading-relaxed"
        placeholder="챕터 내용을 입력하거나 AI 자동 생성을 사용하세요..."
      />

      {/* Sources */}
      {chapter.sources.length > 0 && (
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h4 className="text-sm font-semibold text-zinc-300 mb-3">참고 자료</h4>
          <ul className="space-y-2">
            {chapter.sources.map((source) => (
              <li key={source.id} className="text-sm text-zinc-400">
                <span className="text-zinc-300">{source.author}</span> ({source.year}) - {source.title}
                {source.url && (
                  <span className="text-indigo-400 ml-1">[링크]</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
