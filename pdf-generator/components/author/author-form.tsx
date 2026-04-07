'use client';

import { useBook } from '@/lib/book-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Upload } from 'lucide-react';

export function AuthorForm() {
  const { book, dispatch } = useBook();
  const { author } = book;
  const updateAuthor = (updates: Partial<typeof author>) => dispatch({ type: 'SET_AUTHOR', payload: updates });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateAuthor({ photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Photo + Name */}
        <Card>
          <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary border overflow-hidden flex items-center justify-center shrink-0">
                {author.photo ? (
                  <img src={author.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-muted-foreground">👤</span>
                )}
              </div>
              <Button variant="outline" asChild>
                <label className="cursor-pointer"><Upload className="size-4" /> 사진 업로드<input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" /></label>
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">이름</label>
              <Input value={author.name} onChange={(e) => updateAuthor({ name: e.target.value })} placeholder="저자 이름" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">소개</label>
              <Textarea value={author.bio} onChange={(e) => updateAuthor({ bio: e.target.value })} placeholder="저자 소개를 작성하세요..." rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card>
          <CardHeader><CardTitle>자격 / 경력</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {author.credentials.map((cred, i) => (
              <div key={i} className="flex gap-2">
                <Input value={cred} onChange={(e) => { const u = [...author.credentials]; u[i] = e.target.value; updateAuthor({ credentials: u }); }} placeholder="예: 서울대학교 경영학 박사" />
                <Button variant="destructive" size="icon" onClick={() => updateAuthor({ credentials: author.credentials.filter((_, j) => j !== i) })}><X className="size-4" /></Button>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={() => updateAuthor({ credentials: [...author.credentials, ''] })}><Plus className="size-4" /> 추가</Button>
          </CardContent>
        </Card>

        {/* Social */}
        <Card>
          <CardHeader><CardTitle>소셜 링크</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {author.socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => { const u = [...author.socialLinks]; u[i] = { ...u[i], platform: e.target.value }; updateAuthor({ socialLinks: u }); }}
                  className="w-32 h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">플랫폼</option>
                  {['LinkedIn', 'Twitter', 'GitHub', 'YouTube', 'Blog'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <Input value={link.url} onChange={(e) => { const u = [...author.socialLinks]; u[i] = { ...u[i], url: e.target.value }; updateAuthor({ socialLinks: u }); }} placeholder="URL" />
                <Button variant="destructive" size="icon" onClick={() => updateAuthor({ socialLinks: author.socialLinks.filter((_, j) => j !== i) })}><X className="size-4" /></Button>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={() => updateAuthor({ socialLinks: [...author.socialLinks, { platform: '', url: '' }] })}><Plus className="size-4" /> 추가</Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-8 self-start">
        <h3 className="text-lg font-semibold mb-4">미리보기</h3>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-secondary border-2 border-primary/30 overflow-hidden mb-4">
              {author.photo ? <img src={author.photo} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl text-muted-foreground">👤</div>}
            </div>
            <h3 className="text-xl font-bold">{author.name || '저자명'}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{author.bio || '저자 소개가 여기에 표시됩니다.'}</p>
            {author.credentials.filter(Boolean).length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-1 w-full">
                  {author.credentials.filter(Boolean).map((c, i) => <Badge key={i} variant="secondary" className="w-full justify-center">{c}</Badge>)}
                </div>
              </>
            )}
            {author.socialLinks.filter((l) => l.platform).length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                {author.socialLinks.filter((l) => l.platform).map((l, i) => <Badge key={i} variant="outline">{l.platform}</Badge>)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
