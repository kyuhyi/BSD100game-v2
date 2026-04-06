'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CoverEditor } from '@/components/cover/cover-editor';

export default function CoverPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">표지 디자인</h1>
          <p className="text-zinc-400">템플릿을 선택하고 색상, 폰트를 커스터마이즈하세요.</p>
        </div>

        <CoverEditor />

        <div className="mt-12 flex justify-between items-center">
          <Link
            href="/create"
            className="px-6 py-3 text-zinc-400 hover:text-white transition-colors"
          >
            ← 이전
          </Link>
          <Link
            href="/create/chapters"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:scale-105"
          >
            챕터 편집으로 →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
