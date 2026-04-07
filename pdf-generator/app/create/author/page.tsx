'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthorForm } from '@/components/author/author-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function AuthorPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">저자 프로필</h1>
          <p className="text-muted-foreground">eBook에 표시될 저자 정보를 입력하세요.</p>
        </div>
        <AuthorForm />
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild><Link href="/create/chapters"><ArrowLeft className="size-4" /> 챕터 편집</Link></Button>
          <Button size="lg" className="rounded-xl" asChild><Link href="/create/preview">미리보기 <ArrowRight className="size-4" /></Link></Button>
        </div>
      </motion.div>
    </div>
  );
}
