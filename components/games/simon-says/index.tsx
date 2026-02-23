"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const COLORS = [
  { id: 0, color: "#ef4444", light: "#fca5a5", name: "빨강" },
  { id: 1, color: "#22c55e", light: "#86efac", name: "초록" },
  { id: 2, color: "#3b82f6", light: "#93c5fd", name: "파랑" },
  { id: 3, color: "#eab308", light: "#fde047", name: "노랑" },
];

export default function SimonSaysGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState("시작 버튼을 누르세요");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setMessage("잘 보세요...");
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsPlaying(false);
    setMessage("따라 하세요!");
  }, []);

  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    playSequence(newSequence);
  }, [sequence, playSequence]);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    
    // Start with one color
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setTimeout(() => playSequence([firstColor]), 500);
  };

  const handleButtonClick = (colorId: number) => {
    if (isPlaying || gameOver || !started) return;
    
    setActiveButton(colorId);
    setTimeout(() => setActiveButton(null), 200);
    
    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);
    
    // Check if correct
    const currentIndex = newPlayerSequence.length - 1;
    if (sequence[currentIndex] !== colorId) {
      // Wrong!
      setGameOver(true);
      setMessage("틀렸어요! 😢");
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }
    
    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      setScore(s => s + sequence.length);
      setMessage("정답! 🎉");
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ minHeight: "520px", background: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)" }}>
      <div className="p-4 sm:p-6">
        {!started && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">사이먼 세즈</h2>
            <p className="text-zinc-400 text-sm mb-4 text-center">색깔 순서를 기억하고 따라 하세요!</p>
            {highScore > 0 && (
              <div className="mb-4 text-yellow-400 text-sm">🏆 최고 점수: {highScore}</div>
            )}
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all text-lg"
            >
              게임 시작
            </button>
          </div>
        )}

        {gameOver && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-400 mb-4">게임 오버!</h2>
            <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-6 mb-6 text-center border border-zinc-700">
              <div className="text-zinc-400 text-sm mb-1">점수</div>
              <div className="text-5xl font-black text-white mb-2">{score}</div>
              <div className="text-white/60 text-sm">라운드: {sequence.length}</div>
              {score > 0 && score >= highScore && (
                <div className="mt-2 text-yellow-400 text-sm">🎉 새로운 최고 기록!</div>
              )}
            </div>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              다시 하기
            </button>
          </div>
        )}

        {started && !gameOver && (
          <div className="flex flex-col items-center">
            {/* Stats */}
            <div className="flex justify-between items-center w-full mb-4">
              <div className="bg-black/30 backdrop-blur rounded-xl px-4 py-2">
                <span className="text-zinc-400 text-xs block">점수</span>
                <span className="text-xl font-black text-white">{score}</span>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl px-4 py-2 text-center">
                <span className="text-zinc-400 text-xs block">라운드</span>
                <span className="text-xl font-black text-white">{sequence.length}</span>
              </div>
            </div>

            {/* Message */}
            <div className={`mb-6 px-6 py-2 rounded-full text-lg font-bold ${
              isPlaying ? 'bg-yellow-500/20 text-yellow-400' : 'bg-violet-500/20 text-violet-400'
            }`}>
              {message}
            </div>

            {/* Simon Board */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleButtonClick(c.id)}
                  disabled={isPlaying}
                  className={`aspect-square rounded-2xl transition-all duration-150 transform ${
                    isPlaying ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    background: activeButton === c.id 
                      ? `linear-gradient(135deg, ${c.light}, ${c.color})`
                      : `linear-gradient(135deg, ${c.color}99, ${c.color}66)`,
                    boxShadow: activeButton === c.id 
                      ? `0 0 30px ${c.color}, inset 0 0 20px ${c.light}50`
                      : `0 4px 15px ${c.color}40`,
                    border: `3px solid ${activeButton === c.id ? c.light : c.color}`,
                  }}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="mt-6 flex gap-1">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < playerSequence.length 
                      ? 'bg-emerald-500' 
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
