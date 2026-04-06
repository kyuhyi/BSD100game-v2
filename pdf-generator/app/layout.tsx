import type { Metadata } from 'next';
import { BookProvider } from '@/lib/book-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'PDF eBook Generator',
  description: 'AI 기반 전자책 자동 생성기 - 표지 디자인, 3D 목업, 챕터 시각화, PDF 내보내기',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <BookProvider>
          {children}
        </BookProvider>
      </body>
    </html>
  );
}
