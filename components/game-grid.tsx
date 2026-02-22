"use client";

import { GAMES } from "@/lib/game-catalog";

export default function GameGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10">
      <h2 className="mb-2 text-2xl font-bold text-white">랜덤 게임 목록</h2>
      <p className="mb-5 text-sm text-white/70">총 {GAMES.length}개 게임</p>
      {GAMES.length === 0 && (
        <div className="rounded-xl border border-white/15 bg-white/5 p-8 text-center text-white/70">
          게임 목록을 모두 제거했습니다.
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {GAMES.map((game) => (
          <a
            key={game.id}
            href={`/play/${encodeURIComponent(game.id)}`}
            className="overflow-hidden rounded-xl border border-white/15 bg-white/5 transition hover:-translate-y-0.5 hover:border-cyan-300/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            <img src={game.thumbnail} alt={game.title} className="h-32 w-full object-cover" loading="lazy" />
            <div className="p-2">
              <p className="text-sm text-white/90">{game.title}</p>
              <p className="text-[11px] text-white/55">{game.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
