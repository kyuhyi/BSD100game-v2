'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBook } from '@/lib/book-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, RotateCcw } from 'lucide-react';

export default function CreateStartPage() {
  const { book, dispatch } = useBook();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">새 eBook 만들기</h1>
        <p className="text-muted-foreground mb-10">기본 정보를 입력하고 시작하세요.</p>

        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>eBook의 제목과 부제목을 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">eBook 제목</label>
              <Input
                value={book.title}
                onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
                placeholder="예: 디지털 마케팅 완벽 가이드"
                className="h-12 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">부제목</label>
              <Input
                value={book.subtitle}
                onChange={(e) => dispatch({ type: 'SET_SUBTITLE', payload: e.target.value })}
                placeholder="예: 초보자부터 전문가까지"
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">빠른 주제 선택</label>
              <div className="flex flex-wrap gap-2">
                {['비즈니스', '기술/IT', '마케팅', '자기개발', '건강', '금융/투자', '교육', '디자인'].map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                    onClick={() => { if (!book.title) dispatch({ type: 'SET_TITLE', payload: `${topic} 완벽 가이드` }); }}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between items-center">
          <Button variant="ghost" onClick={() => dispatch({ type: 'RESET_BOOK' })}>
            <RotateCcw className="size-4" />
            초기화
          </Button>
          <Button size="lg" className="rounded-xl" asChild>
            <Link href="/create/cover">
              표지 디자인으로
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
