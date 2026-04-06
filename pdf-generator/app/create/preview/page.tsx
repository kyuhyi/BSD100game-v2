'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBook } from '@/lib/book-context';
import { CoverPreview } from '@/components/cover/cover-preview';
import { BookPreview } from '@/components/preview/book-preview';
import { ExportButton } from '@/components/preview/export-button';
import dynamic from 'next/dynamic';

const BookScene = dynamic(
  () => import('@/components/three-d/book-scene').then((mod) => ({ default: mod.BookScene })),
  { ssr: false, loading: () => <div className="w-full aspect-square bg-zinc-900 rounded-xl animate-pulse" /> }
);

export default function PreviewPage() {
  const { book } = useBook();

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">미리보기 & 내보내기</h1>
            <p className="text-zinc-400">eBook의 최종 모습을 확인하고 PDF로 내보내세요.</p>
          </div>
          <ExportButton />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '제목', value: book.title || '미설정', color: 'text-indigo-400' },
            { label: '챕터', value: `${book.chapters.length}개`, color: 'text-purple-400' },
            { label: '저자', value: book.author.name || '미설정', color: 'text-cyan-400' },
            { label: '템플릿', value: book.cover.templateId, color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-500 mb-1">{stat.label}</div>
              <div className={`font-semibold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover + 3D Mockup */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">표지</h3>
              <CoverPreview
                title={book.title}
                subtitle={book.subtitle}
                authorName={book.author.name}
                cover={book.cover}
                className="max-w-xs"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">3D 목업</h3>
              <BookScene
                colorScheme={book.cover.colorScheme}
                title={book.title}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* Content Preview */}
          <div className="lg:col-span-2">
            <BookPreview />
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <Link href="/create/author" className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">
            ← 저자 프로필
          </Link>
          <ExportButton />
        </div>
      </motion.div>
    </div>
  );
}
