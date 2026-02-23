"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

type Operation = "+" | "-" | "×";

function generateProblem(difficulty: number): { question: string; answer: number; options: number[] } {
  const ops: Operation[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  
  let a: number, b: number, answer: number;
  const maxNum = 10 + difficulty * 5;
  
  if (op === "+") {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * maxNum) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * maxNum) + 10;
    b = Math.floor(Math.random() * Math.min(a, maxNum)) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * (5 + difficulty)) + 2;
    b = Math.floor(Math.random() * (5 + difficulty)) + 2;
    answer = a * b;
  }
  
  // Generate wrong options
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = answer + (offset === 0 ? 1 : offset);
    if (wrong !== answer && wrong > 0) wrongOptions.add(wrong);
  }
  
  const options = [answer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);
  
  return { question: `${a} ${op} ${b}`, answer, options };
}

export default function MathBlitzGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [problem, setProblem] = useState<ReturnType<typeof generateProblem> | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showBonus, setShowBonus] = useState(false);

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
    if (started && !gameOver && !problem) {
      setProblem(generateProblem(difficulty));
    }
  }, [started, gameOver, problem, difficulty]);

  // Increase difficulty
  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setDifficulty((d) => d + 1);
    }
  }, [score]);

  const answer = useCallback((selected: number) => {
    if (!problem || gameOver) return;
    
    const correct = selected === problem.answer;
    if (correct) {
      setFeedback("correct");
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      
      // Bonus for streak
      let points = 10;
      if (newStreak >= 5) {
        points = 20;
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 500);
      }
      if (newStreak >= 10) points = 30;
      
      setScore((s) => s + points);
      setTimeLeft((t) => Math.min(60, t + 1)); // Bonus time for correct
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeLeft((t) => Math.max(0, t - 3));
    }
    
    setTimeout(() => {
      setFeedback(null);
      setProblem(generateProblem(difficulty));
    }, 300);
  }, [problem, gameOver, streak, difficulty]);

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setDifficulty(1);
    setProblem(generateProblem(1));
  };

  const progressWidth = (timeLeft / 60) * 100;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: "500px", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)" }}>
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-6">
        {!started && (
          <div className="flex flex-col items-center justify-center min-h-[450px]">
            <div className="text-6xl mb-4">🧮</div>
            <h2 className="text-3xl font-black text-white mb-2">넘버 크런치</h2>
            <p className="text-indigo-300/80 text-sm mb-8">빠르게 암산하고 정답을 고르세요!</p>
            <div className="text-white/50 text-sm mb-6 text-center">
              <p>정답 +10점 (연속 5개 이상 +20점)</p>
              <p>오답 -3초</p>
            </div>
            <button 
              onClick={() => setStarted(true)}
              className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
            >
              도전!
            </button>
          </div>
        )}

        {gameOver && (
          <div className="flex flex-col items-center justify-center min-h-[450px]">
            <h2 className="text-3xl font-black text-indigo-400 mb-6">시간 종료!</h2>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-10 py-8 mb-6 text-center border border-white/20">
              <div className="text-indigo-300 text-sm mb-1">최종 점수</div>
              <div className="text-6xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{score}</div>
              <div className="mt-4 flex gap-6 text-center">
                <div>
                  <div className="text-white/50 text-xs">최고 연속</div>
                  <div className="text-2xl font-bold text-yellow-400">🔥 {bestStreak}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs">도달 난이도</div>
                  <div className="text-2xl font-bold text-purple-400">Lv.{difficulty}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={restart}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              다시 도전
            </button>
          </div>
        )}

        {started && !gameOver && problem && (
          <div className="flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4">
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                <div className="text-indigo-300 text-xs">점수</div>
                <div className="text-2xl font-black text-white">{score}</div>
              </div>
              <div className="flex flex-col items-center">
                {streak >= 3 && (
                  <div className="text-yellow-400 font-bold animate-pulse">🔥 {streak}연속!</div>
                )}
                <div className="text-white/50 text-xs">Lv.{difficulty}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                <div className="text-rose-300 text-xs">시간</div>
                <div className={`text-2xl font-black ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            {/* Bonus indicator */}
            {showBonus && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-3xl font-black text-yellow-400 animate-bounce">
                +20 BONUS!
              </div>
            )}

            {/* Question */}
            <div className={`w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-150 ${
              feedback === "correct" ? "border-emerald-500 scale-105" :
              feedback === "wrong" ? "border-rose-500 scale-95" :
              "border-white/20"
            }`}>
              <div className="text-center mb-8">
                <span className="text-6xl sm:text-7xl font-black text-white tracking-wider">
                  {problem.question}
                </span>
                <span className="text-4xl sm:text-5xl font-black text-indigo-400 ml-4">=</span>
                <span className="text-4xl sm:text-5xl font-black text-indigo-400 ml-4">?</span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {problem.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => answer(opt)}
                    className="py-4 text-2xl font-bold text-white bg-gradient-to-br from-indigo-600/50 to-purple-600/50 rounded-xl border border-white/20 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
