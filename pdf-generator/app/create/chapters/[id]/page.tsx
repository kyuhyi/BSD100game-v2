'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChapterEditor } from '@/components/chapters/chapter-editor';
import { ChapterVisualization } from '@/components/visualization/chapter-chart';

export default function ChapterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/create/chapters"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          ← 챕터 목록으로
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChapterEditor chapterId={id} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <ChapterVisualization chapterId={id} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
