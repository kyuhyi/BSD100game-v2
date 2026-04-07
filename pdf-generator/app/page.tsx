'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MasonryGallery } from '@/components/landing/masonry-gallery';
import { FeatureHighlights } from '@/components/landing/feature-highlights';
import { BookOpen, Sparkles, FileDown } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-background to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.645_0.2_275/0.15),transparent_70%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 text-primary">
              <Sparkles className="size-3.5 mr-1.5" />
              AI-Powered eBook Creator
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
          >
            전문적인 eBook을
            <br />
            자동으로 생성하세요
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          >
            표지 디자인, 3D 목업, 챕터별 시각화, 통계 분석까지.
            <br />
            클릭 몇 번으로 완성된 전자책을 PDF로 내보내세요.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
          >
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl" asChild>
              <Link href="/create">eBook 만들기</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl" asChild>
              <a href="#gallery">샘플 보기</a>
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center gap-12 mt-16"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          >
            {[
              { icon: <BookOpen className="size-5" />, value: '5+', label: '표지 템플릿' },
              { icon: <Sparkles className="size-5" />, value: '3D', label: '북 목업' },
              { icon: <FileDown className="size-5" />, value: 'PDF', label: '즉시 내보내기' },
            ].map((stat) => (
              <div key={stat.label} className="text-center flex flex-col items-center gap-1">
                <div className="text-primary mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <FeatureHighlights />

      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4">샘플 갤러리</h2>
            <p className="text-muted-foreground text-lg">다양한 템플릿으로 만든 eBook 예시</p>
          </motion.div>
          <MasonryGallery />
        </div>
      </section>

      <footer className="py-8 border-t text-center text-muted-foreground text-sm">
        <p>PDF eBook Generator &copy; 2026</p>
      </footer>
    </main>
  );
}
