"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type Note = { id: number; lane: number; y: number; hit: boolean };

const LANE_COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#a855f7"];
const HIT_ZONE = 75; // 퍼센트 위치

export default function BeatCatcherGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pressedLanes, setPressedLanes] = useState<boolean[]>([false, false, false, false]);
  const [timeLeft, setTimeLeft] = useState(45);
  const noteIdRef = useRef(0);

  // 타이머
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

  // 노트 생성
  useEffect(() => {
    if (!started || gameOver) return;
    
    const spawn = setInterval(() => {
      // 1~2개 노트 동시 생성
      const count = Math.random() < 0.7 ? 1 : 2;
      const lanes = [0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, count);
      
      lanes.forEach((lane) => {
        setNotes((prev) => [...prev, {
          id: noteIdRef.current++,
          lane,
          y: 0,
          hit: false,
        }]);
      });
    }, 1000);
    
    return () => clearInterval(spawn);
  }, [started, gameOver]);

  // 노트 이동
  useEffect(() => {
    if (!started || gameOver) return;
    
    const move = setInterval(() => {
      setNotes((prev) => {
        const updated = prev.map((n) => ({ ...n, y: n.y + 2 }));
        
        // 놓친 노트 체크
        const missed = updated.filter((n) => n.y > 90 && !n.hit);
        if (missed.length > 0) {
          setCombo(0);
          setFeedback("MISS");
          setTimeout(() => setFeedback(null), 300);
        }
        
        return updated.filter((n) => n.y <= 95);
      });
    }, 50);
    
    return () => clearInterval(move);
  }, [started, gameOver]);

  const hitLane = useCallback((lane: number) => {
    if (!started || gameOver) return;
    
    setNotes((prev) => {
      // 해당 레인에서 히트존 근처 노트 찾기
      const target = prev.find((n) => 
        n.lane === lane && !n.hit && n.y >= HIT_ZONE - 15 && n.y <= HIT_ZONE + 10
      );
      
      if (!target) {
        setCombo(0);
        return prev;
      }
      
      const distance = Math.abs(target.y - HIT_ZONE);
      let points = 0;
      let text = "";
      
      if (distance < 5) {
        points = 100;
        text = "PERFECT!";
      } else if (distance < 10) {
        points = 70;
        text = "GREAT!";
      } else {
        points = 40;
        text = "GOOD";
      }
      
      setFeedback(text);
      setTimeout(() => setFeedback(null), 300);
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setScore((s) => s + points + Math.min(newCombo, 20) * 2);
      
      return prev.map((n) => n.id === target.id ? { ...n, hit: true } : n);
    });
  }, [started, gameOver, combo]);

  const handlePress = (lane: number) => {
    setPressedLanes((p) => { const n = [...p]; n[lane] = true; return n; });
    hitLane(lane);
  };

  const handleRelease = (lane: number) => {
    setPressedLanes((p) => { const n = [...p]; n[lane] = false; return n; });
  };

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setNotes([]);
    setTimeLeft(45);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden select-none" style={{ height: "480px", background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)" }}>
      {!started && (
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="text-5xl mb-4">🎵</div>
          <h2 className="text-2xl font-black text-white mb-2">비트 캐처</h2>
          <p className="text-purple-300/80 text-sm mb-6 text-center">
            노트가 내려오면 버튼을 눌러요!
          </p>
          <button 
            onClick={() => setStarted(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            시작
          </button>
        </div>
      )}

      {gameOver && (
        <div className="h-full flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-black text-purple-400 mb-4">게임 종료!</h2>
          <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-6 mb-6 text-center border border-purple-500/30">
            <div className="text-purple-300 text-sm mb-1">점수</div>
            <div className="text-5xl font-black text-white">{score}</div>
            <div className="mt-2 text-white/60 text-sm">최대 콤보: {maxCombo}</div>
          </div>
          <button 
            onClick={restart}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            다시 하기
          </button>
        </div>
      )}

      {started && !gameOver && (
        <div className="h-full flex flex-col">
          {/* 상단 HUD */}
          <div className="flex justify-between items-center px-4 py-2 bg-black/30">
            <div className="text-center">
              <div className="text-purple-300 text-[10px]">점수</div>
              <div className="text-lg font-black text-white">{score}</div>
            </div>
            <div className="text-center min-w-[80px]">
              {feedback && (
                <div className={`text-lg font-black animate-pulse ${
                  feedback === "PERFECT!" ? "text-yellow-400" :
                  feedback === "GREAT!" ? "text-cyan-400" :
                  feedback === "GOOD" ? "text-green-400" : "text-rose-400"
                }`}>
                  {feedback}
                </div>
              )}
              {combo > 3 && !feedback && (
                <div className="text-yellow-400 font-bold text-sm">{combo} combo</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-rose-300 text-[10px]">시간</div>
              <div className={`text-lg font-black ${timeLeft <= 10 ? 'text-rose-400' : 'text-white'}`}>{timeLeft}s</div>
            </div>
          </div>

          {/* 게임 영역 */}
          <div className="flex-1 relative">
            {/* 레인 배경 */}
            <div className="absolute inset-0 flex">
              {[0, 1, 2, 3].map((lane) => (
                <div key={lane} className="flex-1 border-x border-white/5" />
              ))}
            </div>

            {/* 히트존 라인 */}
            <div 
              className="absolute left-0 right-0 h-1 bg-white/30"
              style={{ top: `${HIT_ZONE}%` }}
            />

            {/* 노트들 */}
            {notes.filter((n) => !n.hit).map((note) => (
              <div
                key={note.id}
                className="absolute rounded-md transition-none"
                style={{
                  left: `${note.lane * 25 + 2}%`,
                  top: `${note.y}%`,
                  width: "21%",
                  height: "24px",
                  background: LANE_COLORS[note.lane],
                  boxShadow: `0 0 12px ${LANE_COLORS[note.lane]}`,
                }}
              />
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="flex h-20 bg-black/50">
            {[0, 1, 2, 3].map((lane) => (
              <button
                key={lane}
                className={`flex-1 m-1 rounded-lg flex items-center justify-center transition-transform ${
                  pressedLanes[lane] ? 'scale-95 brightness-150' : ''
                }`}
                style={{
                  background: pressedLanes[lane] 
                    ? LANE_COLORS[lane] 
                    : `${LANE_COLORS[lane]}60`,
                  border: `2px solid ${LANE_COLORS[lane]}`,
                }}
                onMouseDown={() => handlePress(lane)}
                onMouseUp={() => handleRelease(lane)}
                onMouseLeave={() => handleRelease(lane)}
                onTouchStart={(e) => { e.preventDefault(); handlePress(lane); }}
                onTouchEnd={(e) => { e.preventDefault(); handleRelease(lane); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
