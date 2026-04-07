'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CoverEditor } from '@/components/cover/cover-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CoverPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">표지 디자인</h1>
          <p className="text-muted-foreground">템플릿을 선택하고 색상, 폰트를 커스터마이즈하세요.</p>
        </div>
        <CoverEditor />
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild><Link href="/create"><ArrowLeft className="size-4" /> 이전</Link></Button>
          <Button size="lg" className="rounded-xl" asChild><Link href="/create/chapters">챕터 편집으로 <ArrowRight className="size-4" /></Link></Button>
        </div>
      </motion.div>
    </div>
  );
}
