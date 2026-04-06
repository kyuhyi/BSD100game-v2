'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthorForm } from '@/components/author/author-form';

export default function AuthorPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">저자 프로필</h1>
          <p className="text-zinc-400">eBook에 표시될 저자 정보를 입력하세요.</p>
        </div>

        <AuthorForm />

        <div className="mt-12 flex justify-between items-center">
          <Link href="/create/chapters" className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">
            ← 챕터 편집
          </Link>
          <Link
            href="/create/preview"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:scale-105"
          >
            미리보기 →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
