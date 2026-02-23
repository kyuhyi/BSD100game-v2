"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type GameState = "waiting" | "ready" | "go" | "clicked" | "early" | "result";

export default function ReflexMasterGame() {
  const [state, setState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = useCallback(() => {
    setState("ready");
    setReactionTime(null);
    
    // Random delay between 1-4 seconds
    const delay = 1000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setState("go");
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === "waiting" || state === "result") {
      setRound((r) => r + 1);
      startRound();
      return;
    }
    
    if (state === "ready") {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState("early");
      return;
    }
    
    if (state === "go") {
      const time = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(time);
      setAttempts((prev) => [...prev, time]);
      setBestTime((best) => best === null ? time : Math.min(best, time));
      setState("clicked");
    }
  }, [state, startRound]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getGrade = (time: number): { text: string; color: string; emoji: string } => {
    if (time < 150) return { text: "초인!", emoji: "⚡", color: "text-yellow-400" };
    if (time < 200) return { text: "번개!", emoji: "🌟", color: "text-cyan-400" };
    if (time < 250) return { text: "빠름!", emoji: "🚀", color: "text-green-400" };
    if (time < 300) return { text: "좋음!", emoji: "👍", color: "text-blue-400" };
    if (time < 400) return { text: "보통", emoji: "😊", color: "text-white" };
    return { text: "느림", emoji: "🐢", color: "text-orange-400" };
  };

  const avgTime = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : null;

  const bgColor = state === "ready" ? "from-rose-900 to-rose-950" :
                  state === "go" ? "from-emerald-600 to-emerald-800" :
                  state === "early" ? "from-orange-700 to-orange-900" :
                  state === "clicked" ? "from-cyan-700 to-cyan-900" :
                  "from-slate-900 to-slate-950";

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 bg-gradient-to-br ${bgColor}`}
      style={{ minHeight: "500px" }}
      onClick={handleClick}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center min-h-[500px]">
        {state === "waiting" && (
          <>
            <div className="text-7xl mb-6">⚡</div>
            <h2 className="text-3xl font-black text-white mb-2">반응속도 테스트</h2>
            <p className="text-cyan-300/80 text-sm mb-8 text-center">
              초록색이 되면 최대한 빨리 클릭!
            </p>
            <div className="px-8 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
              <span className="text-white/80">화면을 클릭해서 시작</span>
            </div>
            {bestTime && (
              <div className="mt-6 text-center">
                <div className="text-yellow-400">최고 기록</div>
                <div className="text-3xl font-black text-white">{bestTime}ms</div>
              </div>
            )}
          </>
        )}

        {state === "ready" && (
          <>
            <div className="text-8xl mb-6 animate-pulse">🔴</div>
            <h2 className="text-3xl font-black text-white mb-4">기다리세요...</h2>
            <p className="text-rose-200/80 text-lg">초록색이 되면 클릭!</p>
          </>
        )}

        {state === "go" && (
          <>
            <div className="text-8xl mb-6 animate-bounce">🟢</div>
            <h2 className="text-5xl font-black text-white animate-pulse">클릭!</h2>
          </>
        )}

        {state === "early" && (
          <>
            <div className="text-8xl mb-6">😅</div>
            <h2 className="text-3xl font-black text-orange-300 mb-4">너무 일찍!</h2>
            <p className="text-white/80 text-lg mb-8">초록색이 될 때까지 기다리세요</p>
            <button 
              className="px-8 py-4 bg-white/20 backdrop-blur rounded-2xl border border-white/20 text-white font-bold hover:bg-white/30 transition-all"
              onClick={(e) => { e.stopPropagation(); setState("waiting"); }}
            >
              다시 시도
            </button>
          </>
        )}

        {state === "clicked" && reactionTime && (
          <>
            {(() => {
              const grade = getGrade(reactionTime);
              return (
                <>
                  <div className="text-7xl mb-4">{grade.emoji}</div>
                  <h2 className={`text-2xl font-black ${grade.color} mb-2`}>{grade.text}</h2>
                </>
              );
            })()}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-12 py-8 mb-6 text-center border border-white/20">
              <div className="text-cyan-300 text-sm mb-1">반응 속도</div>
              <div className="text-6xl font-black text-white">{reactionTime}<span className="text-2xl text-white/60">ms</span></div>
            </div>
            <div className="flex gap-8 mb-6">
              {bestTime && (
                <div className="text-center">
                  <div className="text-yellow-300 text-xs">최고 기록</div>
                  <div className="text-xl font-bold text-white">{bestTime}ms</div>
                </div>
              )}
              {avgTime && (
                <div className="text-center">
                  <div className="text-white/50 text-xs">평균 ({attempts.length}회)</div>
                  <div className="text-xl font-bold text-white">{avgTime}ms</div>
                </div>
              )}
            </div>
            <p className="text-white/60 text-sm">클릭해서 다시 시도</p>
          </>
        )}

        {/* Round indicator */}
        {round > 0 && state !== "waiting" && (
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur rounded-lg px-3 py-1">
            <span className="text-white/60 text-sm">라운드 {round}</span>
          </div>
        )}
      </div>
    </div>
  );
}
