"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function Counter({ end, duration = 2, suffix = "", prefix = "", decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  delay?: number;
}

function StatItem({ value, suffix = "", prefix = "", label, decimals = 0, delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center"
    >
      <div className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          <Counter end={value} suffix={suffix} prefix={prefix} decimals={decimals} />
        </span>
      </div>
      <div className="mt-2 text-sm font-medium text-white/70 md:text-base">{label}</div>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a12] to-[#0f0f1e] py-16 md:py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            BSD 바이브코딩과 함께한
            <span className="ml-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              성장 스토리
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-8 md:gap-12">
          <StatItem
            value={159}
            suffix="명"
            label="수강생"
            delay={0}
          />
          <StatItem
            value={4.9}
            decimals={1}
            label="만족도"
            delay={0.15}
          />
          <StatItem
            value={99}
            suffix="%"
            label="완주율"
            delay={0.3}
          />
        </div>

        {/* Additional trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 md:gap-8 md:text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span>38+ 게임 제공</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span>실시간 업데이트</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span>모바일 최적화</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
