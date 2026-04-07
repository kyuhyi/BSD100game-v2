'use client';

import { useBook } from '@/lib/book-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function BookPreview() {
  const { book } = useBook();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">목차 & 내용 미리보기</h3>

      <Card>
        <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">목차</CardTitle></CardHeader>
        <CardContent>
          {book.chapters.length === 0 ? (
            <p className="text-sm text-muted-foreground">챕터가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {book.chapters.map((ch, i) => (
                <div key={ch.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-primary font-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm">{ch.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{ch.content ? `${Math.ceil(ch.content.length / 500)}p` : '-'}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {book.chapters.map((chapter, i) => (
        <Card key={chapter.id}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">CH.{String(i + 1).padStart(2, '0')}</Badge>
              <CardTitle>{chapter.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {chapter.content ? chapter.content.substring(0, 500) + (chapter.content.length > 500 ? '...' : '') : '내용 없음'}
            </p>
            <div className="flex gap-2 mt-4">
              {chapter.visualizations.length > 0 && <Badge variant="secondary">시각화 {chapter.visualizations.length}개</Badge>}
              {chapter.sources.length > 0 && <Badge variant="outline">참고자료 {chapter.sources.length}개</Badge>}
            </div>
          </CardContent>
        </Card>
      ))}

      {book.author.name && (
        <Card>
          <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">저자 소개</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                {book.author.photo ? <img src={book.author.photo} alt="Author" className="w-full h-full object-cover" /> : <span className="text-xl">👤</span>}
              </div>
              <div>
                <div className="font-semibold">{book.author.name}</div>
                <p className="text-sm text-muted-foreground mt-1">{book.author.bio || '소개 없음'}</p>
                {book.author.credentials.filter(Boolean).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.author.credentials.filter(Boolean).map((c, i) => <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
