'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBook } from '@/lib/book-context';

export default function CreateStartPage() {
  const { book, dispatch } = useBook();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">새 eBook 만들기</h1>
        <p className="text-zinc-400 mb-10">기본 정보를 입력하고 시작하세요.</p>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              eBook 제목
            </label>
            <input
              type="text"
              value={book.title}
              onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
              placeholder="예: 디지털 마케팅 완벽 가이드"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              부제목
            </label>
            <input
              type="text"
              value={book.subtitle}
              onChange={(e) => dispatch({ type: 'SET_SUBTITLE', payload: e.target.value })}
              placeholder="예: 초보자부터 전문가까지"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Quick topic selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              빠른 주제 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {['비즈니스', '기술/IT', '마케팅', '자기개발', '건강', '금융/투자', '교육', '디자인'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    if (!book.title) {
                      dispatch({ type: 'SET_TITLE', payload: `${topic} 완벽 가이드` });
                    }
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-indigo-500/50 rounded-lg text-sm text-zinc-300 hover:text-white transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Next step */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => dispatch({ type: 'RESET_BOOK' })}
            className="px-6 py-3 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            초기화
          </button>
          <Link
            href="/create/cover"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:scale-105"
          >
            표지 디자인으로 →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
