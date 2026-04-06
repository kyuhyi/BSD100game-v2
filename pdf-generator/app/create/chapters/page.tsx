'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChapterList } from '@/components/chapters/chapter-list';
import { ContentGenerator } from '@/components/chapters/content-generator';

export default function ChaptersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">챕터 편집</h1>
          <p className="text-zinc-400">AI로 챕터를 자동 생성하거나 직접 추가하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapter list */}
          <div className="lg:col-span-2">
            <ChapterList />
          </div>

          {/* Content generator */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ContentGenerator />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <Link href="/create/cover" className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">
            ← 표지 디자인
          </Link>
          <Link
            href="/create/author"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:scale-105"
          >
            저자 프로필로 →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
