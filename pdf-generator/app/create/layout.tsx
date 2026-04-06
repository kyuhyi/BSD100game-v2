'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const steps = [
  { path: '/create', label: '시작', icon: '🏠' },
  { path: '/create/cover', label: '표지 디자인', icon: '🎨' },
  { path: '/create/chapters', label: '챕터 편집', icon: '📝' },
  { path: '/create/author', label: '저자 프로필', icon: '👤' },
  { path: '/create/preview', label: '미리보기', icon: '📄' },
];

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const currentIndex = steps.findIndex((s) =>
    pathname === s.path || (s.path !== '/create' && pathname.startsWith(s.path))
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col fixed h-full">
        <Link href="/" className="text-xl font-bold text-indigo-400 mb-8 block">
          eBook Generator
        </Link>

        <nav className="flex-1 space-y-1">
          {steps.map((step, i) => {
            const isActive = pathname === step.path || (step.path !== '/create' && pathname.startsWith(step.path));
            const isPast = i < currentIndex;

            return (
              <Link
                key={step.path}
                href={step.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : isPast
                    ? 'text-zinc-300 hover:bg-zinc-800/50'
                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span>{step.label}</span>
                {isPast && <span className="ml-auto text-green-400 text-xs">✓</span>}
              </Link>
            );
          })}
        </nav>

        {/* Progress */}
        <div className="mt-auto pt-6 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 mb-2">진행률</div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(((currentIndex + 1) / steps.length) * 100, 20)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {currentIndex + 1} / {steps.length} 단계
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
