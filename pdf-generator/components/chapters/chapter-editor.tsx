'use client';

import { useBook } from '@/lib/book-context';
import { ChapterLength } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bold, Italic, Heading1, Heading2, Quote, List } from 'lucide-react';

interface ChapterEditorProps {
  chapterId: string;
}

export function ChapterEditor({ chapterId }: ChapterEditorProps) {
  const { book, dispatch } = useBook();
  const chapter = book.chapters.find((c) => c.id === chapterId);

  if (!chapter) return <p className="text-muted-foreground">챕터를 찾을 수 없습니다.</p>;

  return (
    <div className="space-y-6">
      <Input
        value={chapter.title}
        onChange={(e) => dispatch({ type: 'UPDATE_CHAPTER', payload: { id: chapterId, updates: { title: e.target.value } } })}
        className="text-2xl font-bold h-14 border-0 border-b rounded-none px-0 focus-visible:ring-0"
        placeholder="챕터 제목"
      />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">분량:</span>
        {(['short', 'medium', 'long'] as ChapterLength[]).map((len) => (
          <Badge
            key={len}
            variant={chapter.length === len ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => dispatch({ type: 'UPDATE_CHAPTER', payload: { id: chapterId, updates: { length: len } } })}
          >
            {{ short: '짧게', medium: '보통', long: '길게' }[len]}
          </Badge>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-1 p-2 border-b">
          {[
            { icon: Bold, label: 'Bold' },
            { icon: Italic, label: 'Italic' },
            { icon: Heading1, label: 'H1' },
            { icon: Heading2, label: 'H2' },
            { icon: Quote, label: 'Quote' },
            { icon: List, label: 'List' },
          ].map((btn) => (
            <Button key={btn.label} variant="ghost" size="icon" className="h-8 w-8">
              <btn.icon className="size-4" />
            </Button>
          ))}
        </div>
        <CardContent className="p-0">
          <Textarea
            value={chapter.content}
            onChange={(e) => dispatch({ type: 'UPDATE_CHAPTER', payload: { id: chapterId, updates: { content: e.target.value } } })}
            className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-y leading-relaxed"
            placeholder="챕터 내용을 입력하거나 AI 자동 생성을 사용하세요..."
          />
        </CardContent>
      </Card>

      {chapter.sources.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold mb-3">참고 자료</h4>
            <ul className="space-y-2">
              {chapter.sources.map((source) => (
                <li key={source.id} className="text-sm text-muted-foreground">
                  <span className="text-foreground">{source.author}</span> ({source.year}) - {source.title}
                  {source.url && <Badge variant="outline" className="ml-2 text-xs">링크</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
