'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const sampleBooks = [
  { id: 1, title: '디지털 마케팅 완벽 가이드', category: '비즈니스', color: 'from-blue-600 to-cyan-500', chapters: 12 },
  { id: 2, title: 'AI 시대의 리더십', category: '기술', color: 'from-purple-600 to-pink-500', chapters: 8 },
  { id: 3, title: '건강한 식습관의 과학', category: '건강', color: 'from-green-600 to-emerald-500', chapters: 10 },
  { id: 4, title: '스타트업 투자 전략', category: '금융', color: 'from-orange-600 to-yellow-500', chapters: 15 },
  { id: 5, title: '효과적인 시간 관리법', category: '자기개발', color: 'from-rose-600 to-red-500', chapters: 7 },
  { id: 6, title: 'UX 디자인 원칙', category: '디자인', color: 'from-indigo-600 to-violet-500', chapters: 9 },
  { id: 7, title: '데이터 분석 입문', category: '기술', color: 'from-teal-600 to-cyan-500', chapters: 11 },
  { id: 8, title: '글로벌 비즈니스 전략', category: '비즈니스', color: 'from-amber-600 to-orange-500', chapters: 13 },
];

export function MasonryGallery() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {sampleBooks.map((book, i) => {
        const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80', 'h-72', 'h-96'];
        return (
          <motion.div
            key={book.id}
            className={`break-inside-avoid ${heights[i % heights.length]} rounded-2xl bg-gradient-to-br ${book.color} p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3">
                {book.category}
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">{book.title}</h3>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-white/70 text-sm">{book.chapters}개 챕터</span>
              <Link
                href="/create"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              >
                이 템플릿으로 시작
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
