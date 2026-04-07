'use client';

import { useBook } from '@/lib/book-context';
import { DEFAULT_COLOR_SCHEMES, COVER_FONTS, CoverTemplateId } from '@/lib/types';
import { TemplateSelector } from './template-selector';
import { CoverPreview } from './cover-preview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, ImageIcon } from 'lucide-react';

export function CoverEditor() {
  const { book, dispatch } = useBook();
  const colorSchemes = Object.entries(DEFAULT_COLOR_SCHEMES);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: 'SET_COVER', payload: { customImage: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    dispatch({ type: 'SET_COVER', payload: { customImage: undefined } });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Template Selection */}
        <Card>
          <CardHeader><CardTitle>표지 템플릿</CardTitle></CardHeader>
          <CardContent>
            <TemplateSelector
              selected={book.cover.templateId}
              onSelect={(id: CoverTemplateId) => dispatch({ type: 'SET_COVER', payload: { templateId: id } })}
            />
          </CardContent>
        </Card>

        {/* Cover Image */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="size-4" /> 표지 이미지</CardTitle></CardHeader>
          <CardContent>
            {book.cover.customImage ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img src={book.cover.customImage} alt="Cover" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <label className="cursor-pointer">
                        <Upload className="size-3" /> 변경
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={removeImage}>
                      <X className="size-3" /> 삭제
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Upload className="size-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">이미지를 업로드하세요</span>
                <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP 지원</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader><CardTitle>색상 테마</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {colorSchemes.map(([name, scheme]) => (
                <button
                  key={name}
                  onClick={() => dispatch({ type: 'SET_COVER', payload: { colorScheme: scheme } })}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                    book.cover.colorScheme.primary === scheme.primary
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ background: scheme.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: scheme.secondary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: scheme.accent }} />
                  </div>
                  <span className="text-sm capitalize">{name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Font */}
        <Card>
          <CardHeader><CardTitle>폰트</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {COVER_FONTS.map((font) => (
                <Badge
                  key={font}
                  variant={book.cover.fontFamily === font ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => dispatch({ type: 'SET_COVER', payload: { fontFamily: font } })}
                  style={{ fontFamily: font }}
                >
                  {font}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Text Inputs */}
        <Card>
          <CardHeader><CardTitle>텍스트</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">제목</label>
              <Input value={book.title} onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })} placeholder="eBook 제목" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">부제목</label>
              <Input value={book.subtitle} onChange={(e) => dispatch({ type: 'SET_SUBTITLE', payload: e.target.value })} placeholder="부제목" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">저자명</label>
              <Input value={book.author.name} onChange={(e) => dispatch({ type: 'SET_AUTHOR', payload: { name: e.target.value } })} placeholder="저자 이름" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-8 self-start">
        <h3 className="text-lg font-semibold mb-4">실시간 미리보기</h3>
        <div className="max-w-sm mx-auto">
          <CoverPreview title={book.title} subtitle={book.subtitle} authorName={book.author.name} cover={book.cover} />
        </div>
      </div>
    </div>
  );
}
