'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Box, BarChart3, PenLine, User, FileDown } from 'lucide-react';

const features = [
  { icon: <Palette className="size-6" />, title: '표지 디자인 템플릿', description: '5가지 프로페셔널 표지 템플릿으로 나만의 eBook 커버를 디자인하세요.' },
  { icon: <Box className="size-6" />, title: '3D 북 목업', description: 'Three.js 기반 실시간 3D 목업으로 완성된 책의 모습을 미리 확인하세요.' },
  { icon: <BarChart3 className="size-6" />, title: '챕터별 시각화', description: '그래프, 통계, 비교표, 사례 분석을 자동으로 생성하여 챕터에 삽입합니다.' },
  { icon: <PenLine className="size-6" />, title: '휴먼 터치 에디터', description: '리치 텍스트 에디터로 AI가 생성한 콘텐츠를 직접 수정하고 다듬으세요.' },
  { icon: <User className="size-6" />, title: '저자 프로필', description: '저자의 프로필, 자격증, 소셜 링크로 전문성과 신뢰도를 보여주세요.' },
  { icon: <FileDown className="size-6" />, title: 'PDF 즉시 내보내기', description: '완성된 eBook을 고품질 PDF로 즉시 다운로드. 인쇄 및 디지털 배포 가능.' },
];

export function FeatureHighlights() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4">모든 기능을 한곳에</h2>
          <p className="text-muted-foreground text-lg">전자책 제작에 필요한 모든 도구가 준비되어 있습니다</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full hover:border-primary/30 transition-all group">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
