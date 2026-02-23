"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

const COLORS = [
  { name: "빨강", hex: "#ef4444", text: "빨강" },
  { name: "파랑", hex: "#3b82f6", text: "파랑" },
  { name: "초록", hex: "#22c55e", text: "초록" },
  { name: "노랑", hex: "#eab308", text: "노랑" },
  { name: "보라", hex: "#a855f7", text: "보라" },
  { name: "주황", hex: "#f97316", text: "주황" },
];

type Question = {
  text: string;
  color: string;
  isMatch: boolean;
};

function generateQuestion(): Question {
  const textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    text: textColor.name,
    color: displayColor.hex,
    isMatch: textColor.name === displayColor.name,
  };
}

export default function ColorRushGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState<Question | null>(null);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (!started || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, gameOver]);

  useEffect(() => {
    if (started && !gameOver && !question) {
      setQuestion(generateQuestion());
    }
  }, [started, gameOver, question]);

  const answer = useCallback((userAnswer: boolean) => {
    if (!question || gameOver) return;
    
    const correct = question.isMatch === userAnswer;
    if (correct) {
      setFeedback("correct");
      const bonus = Math.min(streak, 10);
      setScore((s) => s + 10 + bonus);
      setStreak((s) => s + 1);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeLeft((t) => Math.max(0, t - 3));
    }
    
    setTimeout(() => {
      setFeedback(null);
      setQuestion(generateQuestion());
    }, 200);
  }, [question, gameOver, streak]);

  useEffect(() => {
    if (!started || gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") answer(true);
      if (e.key === "ArrowRight" || e.key === "d") answer(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver, answer]);

  const restart = () => {
    if (score > highScore) setHighScore(score);
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setQuestion(generateQuestion());
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: "500px", background: "linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%)" }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 p-6 h-full">
        {!started && (
          <div className="flex flex-col items-center justify-center min-h-[450px]">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-3xl font-black text-white mb-2">컬러 러시</h2>
            <p className="text-cyan-300/80 text-sm mb-2 text-center">글자의 <span className="text-yellow-400">뜻</span>과 <span className="text-pink-400">색</span>이 같은가요?</p>
            <p className="text-white/50 text-xs mb-8">틀리면 3초 감소!</p>
            
            <div className="flex gap-4 mb-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-emerald-500/30 rounded text-emerald-300">← / A</span>
                <span>같다</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-rose-500/30 rounded text-rose-300">→ / D</span>
                <span>다르다</span>
              </div>
            </div>
            
            <button 
              onClick={() => setStarted(true)}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              시작하기
            </button>
          </div>
        )}

        {gameOver && (
          <div className="flex flex-col items-center justify-center min-h-[450px]">
            <h2 className="text-3xl font-black text-cyan-400 mb-6">타임 오버!</h2>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-10 py-8 mb-6 text-center border border-white/20">
              <div className="text-cyan-300 text-sm mb-1">최종 점수</div>
              <div className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{score}</div>
              {score > highScore && score > 0 && (
                <div className="mt-2 text-yellow-400 text-sm">🎉 새로운 최고 기록!</div>
              )}
              <div className="mt-4 text-white/50 text-sm">최고 기록: {Math.max(score, highScore)}</div>
            </div>
            <button 
              onClick={restart}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              다시 도전
            </button>
          </div>
        )}

        {started && !gameOver && question && (
          <div className="flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6">
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                <div className="text-cyan-300 text-xs">점수</div>
                <div className="text-2xl font-black text-white">{score}</div>
              </div>
              {streak > 2 && (
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                  <span className="text-yellow-300 font-bold">🔥 {streak}연속</span>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                <div className="text-rose-300 text-xs">시간</div>
                <div className={`text-2xl font-black ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
              </div>
            </div>

            {/* Question Card */}
            <div className={`w-full max-w-md aspect-square flex items-center justify-center rounded-3xl border-4 transition-all duration-150 ${
              feedback === "correct" ? "border-emerald-500 bg-emerald-500/20 scale-105" :
              feedback === "wrong" ? "border-rose-500 bg-rose-500/20 scale-95" :
              "border-white/30 bg-white/5"
            }`}>
              <span 
                className="text-7xl sm:text-8xl font-black select-none"
                style={{ color: question.color, textShadow: `0 0 60px ${question.color}40` }}
              >
                {question.text}
              </span>
            </div>

            {/* Answer buttons */}
            <div className="flex gap-4 mt-8 w-full max-w-md">
              <button 
                onClick={() => answer(true)}
                className="flex-1 py-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-xl font-bold rounded-2xl hover:from-emerald-500 hover:to-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/30"
              >
                ✓ 같다
              </button>
              <button 
                onClick={() => answer(false)}
                className="flex-1 py-6 bg-gradient-to-br from-rose-600 to-rose-700 text-white text-xl font-bold rounded-2xl hover:from-rose-500 hover:to-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/30"
              >
                ✗ 다르다
              </button>
            </div>
            
            <p className="mt-4 text-white/40 text-sm">글자의 뜻과 보이는 색이 같은지 판단하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
