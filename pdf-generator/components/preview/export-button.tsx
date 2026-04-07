'use client';

import { useState } from 'react';
import { useBook } from '@/lib/book-context';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Check } from 'lucide-react';

export function ExportButton() {
  const { book } = useBook();
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');

      const styles = StyleSheet.create({
        page: { padding: 50, fontFamily: 'Helvetica' },
        coverPage: { padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: book.cover.colorScheme.primary, height: '100%' },
        coverTitle: { fontSize: 36, fontWeight: 'bold', color: book.cover.colorScheme.text, textAlign: 'center', marginBottom: 10 },
        coverSubtitle: { fontSize: 16, color: book.cover.colorScheme.text, textAlign: 'center', opacity: 0.8, marginBottom: 40 },
        coverAuthor: { fontSize: 14, color: book.cover.colorScheme.accent, textAlign: 'center' },
        tocTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
        tocItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
        tocText: { fontSize: 14 },
        tocPage: { fontSize: 14, color: '#6b7280' },
        chapterTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
        paragraph: { fontSize: 11, lineHeight: 1.8, marginBottom: 12, color: '#374151' },
        sourceSection: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
        sourceTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
        sourceItem: { fontSize: 9, color: '#6b7280', marginBottom: 4 },
        authorPage: { padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' },
        authorName: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
        authorBio: { fontSize: 11, color: '#4b5563', textAlign: 'center', lineHeight: 1.6, maxWidth: 400 },
        authorCred: { fontSize: 10, color: '#6366f1', marginTop: 4 },
      });

      const EBookDocument = () => (
        <Document>
          <Page size="A4" style={styles.coverPage}>
            <View style={{ padding: 50 }}>
              <Text style={styles.coverTitle}>{book.title || 'Untitled eBook'}</Text>
              {book.subtitle && <Text style={styles.coverSubtitle}>{book.subtitle}</Text>}
              <Text style={styles.coverAuthor}>{book.author.name || 'Anonymous'}</Text>
            </View>
          </Page>
          {book.chapters.length > 0 && (
            <Page size="A4" style={styles.page}>
              <Text style={styles.tocTitle}>목차</Text>
              {book.chapters.map((ch, i) => (
                <View key={ch.id} style={styles.tocItem}>
                  <Text style={styles.tocText}>{`${i + 1}. ${ch.title}`}</Text>
                  <Text style={styles.tocPage}>{i + 3}</Text>
                </View>
              ))}
            </Page>
          )}
          {book.chapters.map((chapter) => (
            <Page key={chapter.id} size="A4" style={styles.page}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              {chapter.content.split('\n\n').map((para, i) => (
                <Text key={i} style={styles.paragraph}>{para}</Text>
              ))}
              {chapter.sources.length > 0 && (
                <View style={styles.sourceSection}>
                  <Text style={styles.sourceTitle}>참고 자료</Text>
                  {chapter.sources.map((s) => (
                    <Text key={s.id} style={styles.sourceItem}>{s.author} ({s.year}) - {s.title}</Text>
                  ))}
                </View>
              )}
            </Page>
          ))}
          {book.author.name && (
            <Page size="A4" style={styles.authorPage}>
              <Text style={styles.authorName}>{book.author.name}</Text>
              {book.author.bio && <Text style={styles.authorBio}>{book.author.bio}</Text>}
              {book.author.credentials.filter(Boolean).map((c, i) => (
                <Text key={i} style={styles.authorCred}>{c}</Text>
              ))}
            </Page>
          )}
        </Document>
      );

      const blob = await pdf(<EBookDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title || 'ebook'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF 내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button size="lg" className="rounded-xl" onClick={handleExport} disabled={isExporting}>
      {isExporting ? <><Loader2 className="size-4 animate-spin" /> PDF 생성 중...</> : exported ? <><Check className="size-4" /> 다운로드 완료!</> : <><FileDown className="size-4" /> PDF 내보내기</>}
    </Button>
  );
}
