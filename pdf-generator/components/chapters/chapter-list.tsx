'use client';

import { useBook } from '@/lib/book-context';
import { Chapter } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from 'lucide-react';

export function ChapterList() {
  const { book, dispatch } = useBook();

  const addChapter = () => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: `챕터 ${book.chapters.length + 1}`,
      order: book.chapters.length,
      content: '',
      length: 'medium',
      visualizations: [],
      sources: [],
    };
    dispatch({ type: 'ADD_CHAPTER', payload: newChapter });
  };

  const removeChapter = (id: string) => dispatch({ type: 'REMOVE_CHAPTER', payload: id });

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...book.chapters];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newChapters.length) return;
    [newChapters[index], newChapters[swapIndex]] = [newChapters[swapIndex], newChapters[index]];
    newChapters.forEach((ch, i) => (ch.order = i));
    dispatch({ type: 'REORDER_CHAPTERS', payload: newChapters });
  };

  return (
    <div className="space-y-3">
      {book.chapters.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-lg mb-2 text-muted-foreground">아직 챕터가 없습니다</p>
          <p className="text-sm text-muted-foreground">챕터를 추가하거나 AI 자동 생성을 사용하세요</p>
        </Card>
      ) : (
        book.chapters.map((chapter, index) => (
          <Card key={chapter.id} className="flex items-center gap-3 p-4 group hover:border-primary/30 transition-all">
            <div className="flex flex-col gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveChapter(index, 'up')} disabled={index === 0}>
                <ChevronUp className="size-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveChapter(index, 'down')} disabled={index === book.chapters.length - 1}>
                <ChevronDown className="size-3" />
              </Button>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{chapter.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{{ short: '짧게', medium: '보통', long: '길게' }[chapter.length]}</Badge>
                <span className="text-xs text-muted-foreground">{chapter.content ? `${chapter.content.length}자` : '내용 없음'}</span>
                {chapter.visualizations.length > 0 && <Badge variant="secondary" className="text-xs">{chapter.visualizations.length}개 시각화</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" asChild><Link href={`/create/chapters/${chapter.id}`}><Pencil className="size-3" /> 편집</Link></Button>
              <Button size="sm" variant="destructive" onClick={() => removeChapter(chapter.id)}><Trash2 className="size-3" /></Button>
            </div>
          </Card>
        ))
      )}
      <Button variant="outline" className="w-full border-dashed" onClick={addChapter}>
        <Plus className="size-4" /> 새 챕터 추가
      </Button>
    </div>
  );
}
