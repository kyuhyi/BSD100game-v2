'use client';

import { useBook } from '@/lib/book-context';

export function AuthorForm() {
  const { book, dispatch } = useBook();
  const { author } = book;

  const updateAuthor = (updates: Partial<typeof author>) => {
    dispatch({ type: 'SET_AUTHOR', payload: updates });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateAuthor({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addCredential = () => {
    updateAuthor({ credentials: [...author.credentials, ''] });
  };

  const updateCredential = (index: number, value: string) => {
    const updated = [...author.credentials];
    updated[index] = value;
    updateAuthor({ credentials: updated });
  };

  const removeCredential = (index: number) => {
    updateAuthor({ credentials: author.credentials.filter((_, i) => i !== index) });
  };

  const addSocialLink = () => {
    updateAuthor({ socialLinks: [...author.socialLinks, { platform: '', url: '' }] });
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...author.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    updateAuthor({ socialLinks: updated });
  };

  const removeSocialLink = (index: number) => {
    updateAuthor({ socialLinks: author.socialLinks.filter((_, i) => i !== index) });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">프로필 사진</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
              {author.photo ? (
                <img src={author.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-zinc-500">👤</span>
              )}
            </div>
            <label className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 cursor-pointer transition-all">
              사진 업로드
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">이름</label>
          <input
            type="text"
            value={author.name}
            onChange={(e) => updateAuthor({ name: e.target.value })}
            placeholder="저자 이름"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">소개</label>
          <textarea
            value={author.bio}
            onChange={(e) => updateAuthor({ bio: e.target.value })}
            placeholder="저자 소개를 작성하세요..."
            rows={4}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all resize-y"
          />
        </div>

        {/* Credentials */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">자격 / 경력</label>
          <div className="space-y-2">
            {author.credentials.map((cred, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={cred}
                  onChange={(e) => updateCredential(i, e.target.value)}
                  placeholder="예: 서울대학교 경영학 박사"
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={() => removeCredential(i)}
                  className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addCredential}
              className="w-full py-2 border border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-500 hover:text-indigo-400 rounded-lg transition-all text-sm"
            >
              + 자격/경력 추가
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">소셜 링크</label>
          <div className="space-y-2">
            {author.socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                  className="w-32 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="">플랫폼</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="GitHub">GitHub</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Blog">Blog</option>
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={() => removeSocialLink(i)}
                  className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addSocialLink}
              className="w-full py-2 border border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-500 hover:text-indigo-400 rounded-lg transition-all text-sm"
            >
              + 소셜 링크 추가
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-8 self-start">
        <h3 className="text-lg font-semibold mb-4">미리보기</h3>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-indigo-500/30 overflow-hidden mb-4">
              {author.photo ? (
                <img src={author.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-500">👤</div>
              )}
            </div>
            <h3 className="text-xl font-bold text-white">{author.name || '저자명'}</h3>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{author.bio || '저자 소개가 여기에 표시됩니다.'}</p>

            {author.credentials.length > 0 && (
              <div className="mt-4 space-y-1 w-full">
                {author.credentials.filter(Boolean).map((cred, i) => (
                  <div key={i} className="text-xs text-indigo-400 bg-indigo-600/10 px-3 py-1.5 rounded-lg">
                    {cred}
                  </div>
                ))}
              </div>
            )}

            {author.socialLinks.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                {author.socialLinks.filter((l) => l.platform).map((link, i) => (
                  <span key={i} className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">
                    {link.platform}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
