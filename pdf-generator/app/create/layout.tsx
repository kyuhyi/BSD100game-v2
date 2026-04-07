'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Home, Palette, FileText, User, Eye, BookOpen, Check } from 'lucide-react';

const steps = [
  { path: '/create', label: '시작', icon: Home },
  { path: '/create/cover', label: '표지 디자인', icon: Palette },
  { path: '/create/chapters', label: '챕터 편집', icon: FileText },
  { path: '/create/author', label: '저자 프로필', icon: User },
  { path: '/create/preview', label: '미리보기', icon: Eye },
];

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) =>
    pathname === s.path || (s.path !== '/create' && pathname.startsWith(s.path))
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col fixed h-full">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary mb-8">
          <BookOpen className="size-5" />
          eBook Generator
        </Link>

        <nav className="flex-1 space-y-1">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = pathname === step.path || (step.path !== '/create' && pathname.startsWith(step.path));
            const isPast = i < currentIndex;

            return (
              <Button
                key={step.path}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-11',
                  isActive && 'bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/20',
                  isPast && 'text-sidebar-foreground',
                  !isActive && !isPast && 'text-muted-foreground'
                )}
                asChild
              >
                <Link href={step.path}>
                  <Icon className="size-4" />
                  <span className="flex-1 text-left">{step.label}</span>
                  {isPast && <Check className="size-3.5 text-green-400" />}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Separator className="my-4" />

        {/* Progress */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">진행률</div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(((currentIndex + 1) / steps.length) * 100, 20)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">
            {currentIndex + 1} / {steps.length} 단계
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        <motion.div key={pathname} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
