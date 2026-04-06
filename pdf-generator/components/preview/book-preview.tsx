'use client';

import { useBook } from '@/lib/book-context';

export function BookPreview() {
  const { book } = useBook();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">목차 & 내용 미리보기</h3>

      {/* Table of Contents */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">목차</h4>
        {book.chapters.length === 0 ? (
          <p className="text-sm text-zinc-500">챕터가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {book.chapters.map((ch, i) => (
              <div key={ch.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-indigo-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-zinc-200">{ch.title}</span>
                </div>
                <span className="text-xs text-zinc-500">
                  {ch.content ? `${Math.ceil(ch.content.length / 500)}p` : '-'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapter previews */}
      {book.chapters.map((chapter, i) => (
        <div key={chapter.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-600/20 px-2 py-0.5 rounded">
              CH.{String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="text-lg font-semibold text-white">{chapter.title}</h4>
          </div>

          {/* Content excerpt */}
          <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
            {chapter.content
              ? chapter.content.substring(0, 500) + (chapter.content.length > 500 ? '...' : '')
              : '내용 없음'}
          </div>

          {/* Visualizations count */}
          {chapter.visualizations.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                시각화 {chapter.visualizations.length}개
              </span>
            </div>
          )}

          {/* Sources count */}
          {chapter.sources.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-1 rounded">
                참고자료 {chapter.sources.length}개
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Author preview */}
      {book.author.name && (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">저자 소개</h4>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
              {book.author.photo ? (
                <img src={book.author.photo} alt="Author" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">👤</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-white">{book.author.name}</div>
              <p className="text-sm text-zinc-400 mt-1">{book.author.bio || '소개 없음'}</p>
              {book.author.credentials.filter(Boolean).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {book.author.credentials.filter(Boolean).map((c, i) => (
                    <span key={i} className="text-xs bg-indigo-600/10 text-indigo-400 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
