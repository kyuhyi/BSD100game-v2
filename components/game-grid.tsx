"use client";

import { GAMES } from "@/lib/game-catalog";
import { useState } from "react";

// YouTube Banner Component
function YouTubeBanner() {
  return (
    <a
      href="https://www.youtube.com/@퍼널띵"
      target="_blank"
      rel="noopener noreferrer"
      className="group col-span-full my-6 block overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 transition-all duration-300 hover:border-red-500/60 hover:shadow-[0_0_40px_rgba(239,68,68,0.2)]"
    >
      <div className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-8">
        {/* Left - YouTube Icon & Text */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30 transition-transform duration-300 group-hover:scale-110">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              퍼널띵 유튜브
            </h3>
            <p className="mt-1 text-sm text-white/60">
              바이브코딩 & AI 자동화 강의 채널
            </p>
          </div>
        </div>

        {/* Right - Subscribe Button */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-white/50 sm:flex">
            <span className="text-2xl">🎬</span>
            <span className="text-sm">무료 강의 영상</span>
          </div>
          <div className="rounded-full bg-red-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-red-600/30 transition-all duration-300 group-hover:bg-red-500 group-hover:shadow-red-500/40">
            구독하기 →
          </div>
        </div>
      </div>

      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500 blur-[80px] transition-all duration-500 group-hover:bg-red-400" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-red-600 blur-[80px] transition-all duration-500 group-hover:bg-red-500" />
      </div>
    </a>
  );
}

// Game Card Component
function GameCard({ game, index, onHover, onLeave }: { 
  game: typeof GAMES[0]; 
  index: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <a
      href={`/play/${encodeURIComponent(game.id)}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 shadow-lg shadow-cyan-500/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {index < 3 && (
          <div className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
            🔥 HOT
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="mb-1 truncate text-sm font-medium text-white/90 transition-colors group-hover:text-cyan-300">
          {game.title}
        </p>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-white/50">
          {game.description}
        </p>
        
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">무료</span>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">브라우저</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.1) 0%, transparent 70%)' }}
      />
    </a>
  );
}

export default function GameGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Split games: first 15 games, then YouTube banner, then rest
  const firstSection = GAMES.slice(0, 15);
  const secondSection = GAMES.slice(15);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12">
      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
            <span className="text-xs font-medium text-cyan-300">LIVE</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            🎮 게임 컬렉션
          </h2>
          <p className="mt-2 text-white/60">
            총 <span className="font-semibold text-cyan-400">{GAMES.length}</span>개의 무료 게임
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70">
            🔥 인기순
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70">
            ⭐ 최신순
          </div>
        </div>
      </div>

      {GAMES.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-12 text-center">
          <div className="mb-4 text-5xl">🎮</div>
          <p className="text-lg text-white/70">게임을 준비 중입니다...</p>
        </div>
      )}

      {/* Game Grid with YouTube Banner in middle */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* First section of games */}
        {firstSection.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index}
            onHover={() => setHoveredId(game.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}

        {/* YouTube Banner - spans full width */}
        <YouTubeBanner />

        {/* Second section of games */}
        {secondSection.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index + 15}
            onHover={() => setHoveredId(game.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      {/* Load more hint */}
      <div className="mt-10 text-center">
        <p className="text-sm text-white/40">
          더 많은 게임이 추가될 예정입니다 ✨
        </p>
      </div>
    </section>
  );
}
