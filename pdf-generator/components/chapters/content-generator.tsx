'use client';

import { useState } from 'react';
import { useBook } from '@/lib/book-context';
import { generateChapters, getAllCategories } from '@/lib/templates/content-templates';
import { ChapterLength } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2 } from 'lucide-react';

export function ContentGenerator() {
  const { book, dispatch } = useBook();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLength, setSelectedLength] = useState<ChapterLength>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = getAllCategories();

  const handleGenerate = async () => {
    if (!selectedCategory) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const chapters = generateChapters(selectedCategory, selectedLength);
    chapters.forEach((chapter) => dispatch({ type: 'ADD_CHAPTER', payload: chapter }));
    if (!book.title) dispatch({ type: 'SET_TITLE', payload: `${selectedCategory} 완벽 가이드` });
    setIsGenerating(false);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /> AI 콘텐츠 자동 생성</CardTitle>
        <CardDescription>주제를 선택하면 챕터와 내용을 자동으로 생성합니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">주제 카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">챕터 분량</label>
          <div className="flex gap-2">
            {([
              { value: 'short' as const, label: '짧게', desc: '2-3단락' },
              { value: 'medium' as const, label: '보통', desc: '5-7단락' },
              { value: 'long' as const, label: '길게', desc: '8+단락' },
            ]).map((opt) => (
              <Card
                key={opt.value}
                className={cn(
                  'flex-1 p-3 cursor-pointer transition-all',
                  selectedLength === opt.value ? 'border-primary bg-primary/10' : 'hover:border-muted-foreground'
                )}
                onClick={() => setSelectedLength(opt.value)}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </Card>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={handleGenerate} disabled={!selectedCategory || isGenerating}>
          {isGenerating ? <><Loader2 className="size-4 animate-spin" /> 생성 중...</> : <><Sparkles className="size-4" /> 챕터 자동 생성</>}
        </Button>
        {book.chapters.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">현재 {book.chapters.length}개 챕터. 새로 생성하면 추가됩니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
