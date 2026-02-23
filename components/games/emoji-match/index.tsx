"use client";

import { useState, useEffect, useMemo } from "react";

const EMOJI_SETS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍒", "🥝", "🍑", "🌸", "🌺", "🌻", "🌷", "⭐", "🌙", "☀️", "🌈"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EmojiMatchGame() {
  const [started, setStarted] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const gridSize = 16; // 4x4
  const pairsCount = gridSize / 2;

  const initGame = () => {
    const selectedEmojis = shuffle(EMOJI_SETS).slice(0, pairsCount);
    const cardPairs = shuffle([...selectedEmojis, ...selectedEmojis]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }));
    setCards(cardPairs);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setTimeElapsed(0);
    setGameWon(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || gameWon) return;
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [started, gameWon]);

  useEffect(() => {
    if (matches === pairsCount && started) {
      setGameWon(true);
      if (!bestTime || timeElapsed < bestTime) {
        setBestTime(timeElapsed);
      }
    }
  }, [matches, pairsCount, started, timeElapsed, bestTime]);

  const handleCardClick = (id: number) => {
    if (flippedIds.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped.map((fid) => cards.find((c) => c.id === fid)!);
      
      if (first.emoji === cards.find((c) => c.id === id)?.emoji && first.id !== id) {
        // Match!
        setTimeout(() => {
          setCards((prev) => prev.map((c) => 
            newFlipped.includes(c.id) ? { ...c, matched: true } : c
          ));
          setMatches((m) => m + 1);
          setFlippedIds([]);
        }, 300);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => prev.map((c) => 
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ minHeight: "520px", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
      <div className="p-4 sm:p-6">
        {!started && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">이모지 매칭</h2>
            <p className="text-purple-300/80 text-sm mb-8 text-center">같은 이모지 짝을 찾아 뒤집으세요!</p>
            {bestTime && (
              <div className="mb-4 text-yellow-400 text-sm">🏆 최고 기록: {formatTime(bestTime)}</div>
            )}
            <button 
              onClick={initGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all text-lg"
            >
              게임 시작
            </button>
          </div>
        )}

        {gameWon && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mb-4">완료!</h2>
            <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-6 mb-6 text-center border border-purple-500/30">
              <div className="text-purple-300 text-sm mb-1">클리어 시간</div>
              <div className="text-4xl font-black text-white mb-2">{formatTime(timeElapsed)}</div>
              <div className="text-white/60 text-sm">총 {moves}번 시도</div>
              {timeElapsed === bestTime && (
                <div className="mt-2 text-yellow-400 text-sm">🎉 새로운 최고 기록!</div>
              )}
            </div>
            <button 
              onClick={initGame}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              다시 하기
            </button>
          </div>
        )}

        {started && !gameWon && (
          <>
            {/* Stats */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-black/30 backdrop-blur rounded-xl px-4 py-2">
                <span className="text-purple-300 text-xs block">시간</span>
                <span className="text-xl font-black text-white">{formatTime(timeElapsed)}</span>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl px-4 py-2">
                <span className="text-pink-300 text-xs block">매칭</span>
                <span className="text-xl font-black text-white">{matches}/{pairsCount}</span>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl px-4 py-2">
                <span className="text-cyan-300 text-xs block">시도</span>
                <span className="text-xl font-black text-white">{moves}</span>
              </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.matched || card.flipped}
                  className={`aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 transform ${
                    card.matched 
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 scale-95' 
                      : card.flipped 
                        ? 'bg-white/20 border-2 border-purple-400 rotate-0' 
                        : 'bg-purple-900/50 border-2 border-purple-700 hover:bg-purple-800/50 hover:scale-105'
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  {card.flipped || card.matched ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
