"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { THUMBNAILS, thumbnailToId } from "@/lib/game-catalog";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

const BENEFIT_LINES = [
  "짧게 3판만 해도 집중력이 올라가서 머리가 빠르게 깨어나요.",
  "가벼운 게임 플레이는 스트레스를 낮추고 기분 전환에 효과적이에요.",
  "매일 3게임 챌린지는 반응 속도와 문제 해결 감각을 자연스럽게 키워줘요."
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function FlipCard({ src, index, target }: FlipCardProps) {
  const gameId = thumbnailToId(src);

  return (
    <motion.div
      animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="group cursor-pointer"
      onClick={() => {
        window.location.href = `/play/${encodeURIComponent(gameId)}`;
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-gray-200 shadow-lg" style={{ backfaceVisibility: "hidden" }}>
          <img src={src} alt={`hero-${index}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-blue-400">Play</p>
            <p className="text-xs font-medium text-white">게임 시작</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function IntroAnimation() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseImages = useMemo(() => THUMBNAILS.slice(0, TOTAL_IMAGES), []);
  const [images, setImages] = useState<string[]>(baseImages);

  useEffect(() => {
    setImages(shuffle(THUMBNAILS).slice(0, TOTAL_IMAGES));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const e = entries[0];
      setContainerSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    observer.observe(containerRef.current);
    setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const atTop = scrollRef.current <= 0;
      const atBottom = scrollRef.current >= MAX_SCROLL;
      const goingUp = e.deltaY < 0;
      const goingDown = e.deltaY > 0;
      if ((atTop && goingUp) || (atBottom && goingDown)) return;

      e.preventDefault();
      const next = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const scatterPositions = useMemo(
    () =>
      images.map((_, i) => ({
        x: (seededRandom(i * 11 + 3) - 0.5) * 1500,
        y: (seededRandom(i * 17 + 7) - 0.5) * 1000,
        rotation: (seededRandom(i * 23 + 13) - 0.5) * 180,
        scale: 0.6,
        opacity: 0
      })),
    [images]
  );

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => {
      u1();
      u2();
      u3();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  useEffect(() => {
    const fullText = BENEFIT_LINES[lineIndex];
    let timer: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (typedText.length < fullText.length) {
        timer = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 45);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 1400);
      }
    } else if (typedText.length > 0) {
      timer = setTimeout(() => setTypedText(fullText.slice(0, typedText.length - 1)), 26);
    } else {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setLineIndex((prev) => (prev + 1) % BENEFIT_LINES.length);
      }, 220);
    }
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, lineIndex]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-black/80">
      <div className="flex h-full w-full flex-col items-center justify-center [perspective:1000px]">
        <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="font-['Pretendard'] text-3xl font-bold tracking-tight text-white md:text-6xl"
          >
            BSD 바퍼 재믹스
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-5 font-['Pretendard'] text-base font-bold tracking-[0.08em] text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse md:text-2xl"
          >
            누구나 가볍게 게임을 즐겨보다
          </motion.p>
        </div>

        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center justify-center px-6 text-center">
          <p className="max-w-5xl font-['Pretendard'] text-xl font-bold leading-snug text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.9)] md:text-4xl lg:text-5xl">
            {typedText}
            <span className="ml-1 animate-pulse text-blue-300">|</span>
          </p>
        </motion.div>

        <div className="relative flex h-full w-full items-center justify-center">
          {images.map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };
            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 70;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.35, 350);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = { x: Math.cos(circleRad) * circleRadius, y: Math.sin(circleRad) * circleRadius, rotation: circleAngle + 90 };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;
              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1
              };
            }

            return <FlipCard key={i} src={src} index={i} target={target} />;
          })}
        </div>
      </div>
    </div>
  );
}
