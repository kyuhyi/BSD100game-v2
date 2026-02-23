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
      className="group relative my-8 block overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]"
    >
      <img 
        src="/youtube.gif" 
        alt="퍼널띵 유튜브 채널" 
        className="w-full h-auto rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
      />
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

      {/* First Game Grid - 3 rows */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {firstSection.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index}
            onHover={() => setHoveredId(game.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      {/* YouTube Banner - between grids */}
      <YouTubeBanner />

      {/* Second Game Grid - remaining games */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
