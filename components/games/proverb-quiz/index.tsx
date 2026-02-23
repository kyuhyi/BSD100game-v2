"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

const PROVERBS = [
  { full: "가는 말이 고와야 오는 말이 곱다", blank: "가는 말이 고와야 오는 말이 ___", answer: "곱다", hint: "아름답다" },
  { full: "낮말은 새가 듣고 밤말은 쥐가 듣는다", blank: "낮말은 새가 듣고 밤말은 ___가 듣는다", answer: "쥐", hint: "작은 동물" },
  { full: "세 살 버릇 여든까지 간다", blank: "세 살 버릇 ___까지 간다", answer: "여든", hint: "80" },
  { full: "백지장도 맞들면 낫다", blank: "___도 맞들면 낫다", answer: "백지장", hint: "하얀 종이" },
  { full: "호랑이도 제 말 하면 온다", blank: "___도 제 말 하면 온다", answer: "호랑이", hint: "무서운 동물" },
  { full: "원숭이도 나무에서 떨어진다", blank: "원숭이도 ___에서 떨어진다", answer: "나무", hint: "식물" },
  { full: "빈 수레가 요란하다", blank: "빈 ___가 요란하다", answer: "수레", hint: "짐을 싣는 것" },
  { full: "뛰는 놈 위에 나는 놈 있다", blank: "뛰는 놈 위에 ___ 놈 있다", answer: "나는", hint: "하늘을 날다" },
  { full: "가랑비에 옷 젖는 줄 모른다", blank: "___에 옷 젖는 줄 모른다", answer: "가랑비", hint: "작은 비" },
  { full: "고래 싸움에 새우 등 터진다", blank: "고래 싸움에 ___ 등 터진다", answer: "새우", hint: "바다 생물" },
  { full: "구슬이 서 말이라도 꿰어야 보배", blank: "구슬이 서 말이라도 꿰어야 ___", answer: "보배", hint: "귀한 것" },
  { full: "등잔 밑이 어둡다", blank: "___ 밑이 어둡다", answer: "등잔", hint: "불을 켜는 것" },
  { full: "아니 땐 굴뚝에 연기 날까", blank: "아니 땐 ___에 연기 날까", answer: "굴뚝", hint: "연기 나가는 곳" },
  { full: "티끌 모아 태산", blank: "티끌 모아 ___", answer: "태산", hint: "큰 산" },
  { full: "하늘의 별 따기", blank: "하늘의 ___ 따기", answer: "별", hint: "밤에 빛나는 것" },
  { full: "바늘 도둑이 소 도둑 된다", blank: "바늘 도둑이 ___ 도둑 된다", answer: "소", hint: "큰 동물" },
  { full: "꿩 대신 닭", blank: "꿩 대신 ___", answer: "닭", hint: "새벽에 우는 새" },
  { full: "서당개 삼 년이면 풍월을 읊는다", blank: "서당개 ___ 년이면 풍월을 읊는다", answer: "삼", hint: "3" },
  { full: "눈 가리고 아웅", blank: "눈 가리고 ___", answer: "아웅", hint: "고양이 소리" },
  { full: "우물 안 개구리", blank: "우물 안 ___", answer: "개구리", hint: "뛰는 양서류" },
];

export default function ProverbQuizGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  
  const shuffledProverbs = useMemo(() => {
    return [...PROVERBS].sort(() => Math.random() - 0.5);
  }, [started]);
  
  const current = shuffledProverbs[currentIndex % shuffledProverbs.length];

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

  const checkAnswer = useCallback(() => {
    if (input.trim() === current.answer) {
      setFeedback("correct");
      const bonus = showHint ? 5 : 10;
      const streakBonus = Math.min(streak, 5) * 2;
      setScore((s) => s + bonus + streakBonus);
      setStreak((s) => s + 1);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setInput("");
        setShowHint(false);
        setFeedback(null);
      }, 600);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => setFeedback(null), 400);
    }
  }, [input, current, showHint, streak]);

  const skip = () => {
    setStreak(0);
    setCurrentIndex((i) => i + 1);
    setInput("");
    setShowHint(false);
  };

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentIndex(0);
    setInput("");
    setShowHint(false);
    setStreak(0);
    setTimeLeft(90);
  };

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden"
      style={{ 
        minHeight: "520px", 
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" 
      }}
    >
      {/* 배경 장식 */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 p-4 sm:p-6">
        {!started && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center">한글 속담 퀴즈</h2>
            <p className="text-amber-300/80 text-sm mb-8 text-center px-4">빈칸에 들어갈 단어를 맞춰보세요!</p>
            <button 
              onClick={() => setStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 text-lg"
            >
              시작하기
            </button>
          </div>
        )}

        {gameOver && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-4">게임 종료!</h2>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-6 mb-6 text-center border border-amber-500/30">
              <div className="text-amber-300 text-sm mb-1">최종 점수</div>
              <div className="text-5xl font-black text-white mb-2">{score}</div>
              <div className="text-white/60 text-sm">맞춘 문제: {currentIndex}개</div>
            </div>
            <button 
              onClick={restart}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              다시 도전
            </button>
          </div>
        )}

        {started && !gameOver && (
          <div className="flex flex-col">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <div className="bg-black/30 backdrop-blur rounded-xl px-3 py-2 min-w-[70px] text-center">
                <span className="text-amber-300 text-[10px] block">점수</span>
                <span className="text-lg font-black text-white">{score}</span>
              </div>
              {streak > 0 && (
                <div className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/40 flex-shrink-0">
                  <span className="text-amber-300 font-bold text-xs">🔥{streak}</span>
                </div>
              )}
              <div className="bg-black/30 backdrop-blur rounded-xl px-3 py-2 min-w-[70px] text-center">
                <span className="text-rose-300 text-[10px] block">시간</span>
                <span className={`text-lg font-black ${timeLeft <= 15 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
              </div>
            </div>

            {/* 문제 카드 */}
            <div className={`w-full bg-black/20 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 transition-all duration-200 ${
              feedback === "correct" ? "border-emerald-500 bg-emerald-500/10" : 
              feedback === "wrong" ? "border-rose-500 bg-rose-500/10 animate-shake" : 
              "border-white/10"
            }`}>
              <div className="text-center mb-5">
                <div className="inline-block bg-amber-500/20 text-amber-400 text-[11px] px-3 py-1 rounded-full mb-3">
                  #{currentIndex + 1}번 문제
                </div>
                <p className="text-base sm:text-lg text-white font-medium leading-relaxed break-keep px-1">
                  {current.blank.split('___').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block mx-1 px-2 py-0.5 bg-amber-500/30 border-b-2 border-amber-400 text-amber-400 rounded text-sm">
                          ?
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  placeholder="정답을 입력하세요"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:bg-white/15 transition-all text-center"
                  autoFocus
                />
                
                <button 
                  onClick={checkAnswer}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  확인
                </button>

                <div className="flex justify-between pt-1">
                  <button 
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="text-xs text-amber-300/70 hover:text-amber-300 disabled:opacity-40 transition-colors"
                  >
                    💡 힌트 보기
                  </button>
                  <button 
                    onClick={skip}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    건너뛰기 →
                  </button>
                </div>

                {showHint && (
                  <div className="text-center text-amber-300/90 bg-amber-500/15 rounded-xl py-2.5 border border-amber-500/30 text-sm">
                    💡 힌트: <span className="font-bold">{current.hint}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 정답 피드백 */}
            {feedback === "correct" && (
              <div className="text-center mt-4 text-2xl animate-bounce text-emerald-400 font-bold">
                ✅ 정답!
              </div>
            )}
            {feedback === "wrong" && (
              <div className="text-center mt-4 text-xl text-rose-400 font-bold">
                ❌ 다시 시도해보세요
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
