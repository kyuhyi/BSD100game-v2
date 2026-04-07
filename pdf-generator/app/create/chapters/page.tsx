'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChapterList } from '@/components/chapters/chapter-list';
import { ContentGenerator } from '@/components/chapters/content-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ChaptersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">챕터 편집</h1>
          <p className="text-muted-foreground">AI로 챕터를 자동 생성하거나 직접 추가하세요.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><ChapterList /></div>
          <div className="lg:col-span-1"><div className="sticky top-8"><ContentGenerator /></div></div>
        </div>
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild><Link href="/create/cover"><ArrowLeft className="size-4" /> 표지 디자인</Link></Button>
          <Button size="lg" className="rounded-xl" asChild><Link href="/create/author">저자 프로필로 <ArrowRight className="size-4" /></Link></Button>
        </div>
      </motion.div>
    </div>
  );
}
