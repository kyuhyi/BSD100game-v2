"use client";

import { useState, useEffect, useCallback } from "react";

// 난이도별 단어 (레벨 올라갈수록 어려운 단어)
const WORDS_EASY = [
  { word: "사랑", hint: "마음의 감정" },
  { word: "행복", hint: "기쁜 상태" },
  { word: "친구", hint: "가까운 사이" },
  { word: "음악", hint: "소리의 예술" },
  { word: "영화", hint: "스크린 예술" },
  { word: "바다", hint: "넓은 물" },
  { word: "하늘", hint: "위를 보면" },
  { word: "나무", hint: "숲을 이루는" },
  { word: "가족", hint: "함께 사는 사람들" },
  { word: "여행", hint: "다른 곳으로" },
  { word: "꿈", hint: "잘 때 보는 것" },
  { word: "별", hint: "밤에 빛나는" },
  { word: "비", hint: "하늘에서 내리는" },
  { word: "눈", hint: "겨울에 오는" },
  { word: "꽃", hint: "봄에 피는" },
  { word: "강", hint: "흐르는 물" },
  { word: "산", hint: "높은 땅" },
  { word: "달", hint: "밤에 뜨는" },
  { word: "햇빛", hint: "태양의 빛" },
  { word: "구름", hint: "하늘에 떠 있는" },
];

const WORDS_MEDIUM = [
  { word: "컴퓨터", hint: "전자기기" },
  { word: "인터넷", hint: "정보의 바다" },
  { word: "스마트폰", hint: "손 안의 세상" },
  { word: "대한민국", hint: "우리나라" },
  { word: "무지개", hint: "비 온 뒤" },
  { word: "아이스크림", hint: "여름 간식" },
  { word: "고속도로", hint: "빠른 길" },
  { word: "도서관", hint: "책 읽는 곳" },
  { word: "병원", hint: "아플 때 가는 곳" },
  { word: "학교", hint: "배우는 곳" },
  { word: "지하철", hint: "땅 밑 교통" },
  { word: "비행기", hint: "하늘을 나는" },
  { word: "수영장", hint: "물에서 운동" },
  { word: "놀이공원", hint: "롤러코스터 있는" },
  { word: "편의점", hint: "24시간 가게" },
  { word: "마트", hint: "장보는 곳" },
  { word: "카페", hint: "커피 마시는 곳" },
  { word: "식당", hint: "밥 먹는 곳" },
  { word: "공원", hint: "산책하는 곳" },
  { word: "체육관", hint: "운동하는 곳" },
  { word: "미술관", hint: "그림 보는 곳" },
  { word: "박물관", hint: "역사 보는 곳" },
  { word: "동물원", hint: "동물 보는 곳" },
  { word: "백화점", hint: "쇼핑하는 곳" },
];

const WORDS_HARD = [
  { word: "프로그래밍", hint: "코딩과 같은 말" },
  { word: "인공지능", hint: "AI" },
  { word: "블록체인", hint: "암호화폐 기술" },
  { word: "메타버스", hint: "가상세계" },
  { word: "자율주행", hint: "스스로 가는 차" },
  { word: "증강현실", hint: "AR" },
  { word: "가상현실", hint: "VR" },
  { word: "빅데이터", hint: "대용량 정보" },
  { word: "클라우드", hint: "인터넷 저장소" },
  { word: "디지털트윈", hint: "가상 복제" },
  { word: "스타트업", hint: "신생 기업" },
  { word: "유니콘기업", hint: "1조원 스타트업" },
  { word: "딥러닝", hint: "심층 학습" },
  { word: "머신러닝", hint: "기계 학습" },
  { word: "알고리즘", hint: "문제 해결 방법" },
  { word: "데이터베이스", hint: "정보 저장소" },
  { word: "사이버보안", hint: "디지털 안전" },
  { word: "전자상거래", hint: "온라인 쇼핑" },
  { word: "소셜미디어", hint: "SNS" },
  { word: "유튜브크리에이터", hint: "영상 제작자" },
];

const WORDS_EXPERT = [
  { word: "양자컴퓨터", hint: "미래의 컴퓨터" },
  { word: "반도체공정", hint: "칩 만드는 과정" },
  { word: "수소연료전지", hint: "친환경 에너지" },
  { word: "탄소중립정책", hint: "환경 목표" },
  { word: "초거대언어모델", hint: "GPT 같은 것" },
  { word: "핵융합발전소", hint: "인공태양" },
  { word: "우주정거장", hint: "ISS" },
  { word: "생명공학기술", hint: "바이오테크" },
  { word: "신경망네트워크", hint: "뇌를 모방한" },
  { word: "자연어처리", hint: "NLP" },
  { word: "컴퓨터비전", hint: "이미지 인식" },
  { word: "분산컴퓨팅", hint: "여러 대가 협력" },
  { word: "강화학습알고리즘", hint: "보상으로 학습" },
  { word: "사물인터넷기기", hint: "IoT 디바이스" },
  { word: "자율비행드론", hint: "스스로 나는" },
  { word: "웨어러블디바이스", hint: "입는 전자기기" },
];

function shuffleWord(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // 섞인 결과가 원본과 같으면 다시 섞기
  const result = arr.join('');
  if (result === word && word.length > 2) {
    return shuffleWord(word);
  }
  return result;
}

function getWordByLevel(level: number, usedWords: Set<string>): { word: string; hint: string } | null {
  let pool: typeof WORDS_EASY;
  
  if (level <= 3) pool = WORDS_EASY;
  else if (level <= 7) pool = WORDS_MEDIUM;
  else if (level <= 12) pool = WORDS_HARD;
  else pool = WORDS_EXPERT;
  
  const available = pool.filter(w => !usedWords.has(w.word));
  if (available.length === 0) {
    // 풀이 비었으면 다음 난이도에서 가져오기
    const allPools = [WORDS_EASY, WORDS_MEDIUM, WORDS_HARD, WORDS_EXPERT];
    for (const p of allPools) {
      const avail = p.filter(w => !usedWords.has(w.word));
      if (avail.length > 0) {
        return avail[Math.floor(Math.random() * avail.length)];
      }
    }
    return null;
  }
  
  return available[Math.floor(Math.random() * available.length)];
}

export default function WordScrambleGame() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentWord, setCurrentWord] = useState<{ word: string; hint: string } | null>(null);
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);

  const nextWord = useCallback(() => {
    const wordData = getWordByLevel(level, usedWords);
    if (!wordData) {
      setGameOver(true);
      return;
    }
    setCurrentWord(wordData);
    setScrambled(shuffleWord(wordData.word));
    setUsedWords(prev => new Set([...prev, wordData.word]));
    setInput("");
    setShowHint(false);
  }, [level, usedWords]);

  useEffect(() => {
    if (started && !gameOver && !currentWord) {
      nextWord();
    }
  }, [started, gameOver, currentWord, nextWord]);

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

  const checkAnswer = () => {
    if (!currentWord) return;
    if (input.trim() === currentWord.word) {
      setFeedback("correct");
      // 글자수에 따른 점수
      const basePoints = currentWord.word.length * 5;
      const hintPenalty = showHint ? Math.floor(basePoints / 2) : 0;
      const streakBonus = Math.min(streak, 5) * 3;
      const finalPoints = basePoints - hintPenalty + streakBonus;
      
      setScore(s => s + finalPoints);
      setLevel(l => l + 1);
      setStreak(s => s + 1);
      setTimeLeft(t => Math.min(60, t + 2));
      
      setTimeout(() => {
        setFeedback(null);
        setCurrentWord(null);
      }, 400);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => setFeedback(null), 300);
    }
  };

  const skip = () => {
    setStreak(0);
    setTimeLeft(t => Math.max(5, t - 5)); // 스킵 패널티
    setCurrentWord(null);
  };

  const restart = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTimeLeft(45);
    setUsedWords(new Set());
    setCurrentWord(null);
    setInput("");
    setStreak(0);
  };

  const getDifficultyLabel = () => {
    if (level <= 3) return { text: "쉬움", color: "text-green-400" };
    if (level <= 7) return { text: "보통", color: "text-yellow-400" };
    if (level <= 12) return { text: "어려움", color: "text-orange-400" };
    return { text: "전문가", color: "text-rose-400" };
  };

  const difficulty = getDifficultyLabel();

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ minHeight: "500px", background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)" }}>
      <div className="p-4">
        {!started && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">🔤</div>
            <h2 className="text-2xl font-black text-white mb-2">단어 뒤집기</h2>
            <p className="text-cyan-300/80 text-sm mb-2 text-center">섞인 글자를 원래 단어로!</p>
            <p className="text-white/60 text-xs mb-6 text-center">레벨이 오르면 단어가 어려워져요</p>
            <button 
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              시작하기
            </button>
          </div>
        )}

        {gameOver && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-black text-cyan-400 mb-4">게임 종료!</h2>
            <div className="bg-black/20 backdrop-blur rounded-2xl px-8 py-5 mb-6 text-center border border-cyan-500/30">
              <div className="text-cyan-300 text-sm mb-1">최종 점수</div>
              <div className="text-4xl font-black text-white mb-2">{score}</div>
              <div className="text-white/60 text-sm">도달 레벨: {level}</div>
            </div>
            <button 
              onClick={restart}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              다시 도전
            </button>
          </div>
        )}

        {started && !gameOver && currentWord && (
          <div className="flex flex-col">
            {/* Stats */}
            <div className="flex justify-between items-center mb-3">
              <div className="bg-black/30 backdrop-blur rounded-xl px-3 py-2 text-center min-w-[65px]">
                <span className="text-cyan-300 text-[10px] block">점수</span>
                <span className="text-lg font-black text-white">{score}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold ${difficulty.color}`}>{difficulty.text}</span>
                <span className="text-white/60 text-[10px]">Lv.{level}</span>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl px-3 py-2 text-center min-w-[65px]">
                <span className="text-rose-300 text-[10px] block">시간</span>
                <span className={`text-lg font-black ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
              </div>
            </div>

            {streak > 1 && (
              <div className="text-center mb-2">
                <span className="text-yellow-400 text-sm font-bold">🔥 {streak}연속!</span>
              </div>
            )}

            {/* Word Card */}
            <div className={`w-full bg-black/20 backdrop-blur-xl rounded-2xl p-4 border-2 transition-all ${
              feedback === "correct" ? "border-emerald-500 bg-emerald-500/10" :
              feedback === "wrong" ? "border-rose-500 bg-rose-500/10" :
              "border-white/10"
            }`}>
              <div className="text-center mb-4">
                <div className="text-cyan-400 text-xs mb-3">이 글자를 맞춰보세요</div>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {scrambled.split('').map((char, i) => (
                    <span 
                      key={i}
                      className="w-10 h-12 sm:w-12 sm:h-14 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-black text-white border border-cyan-400/40"
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-white/50 text-xs">{currentWord.word.length}글자</div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  placeholder="정답 입력"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 text-center"
                  autoFocus
                />
                
                <button 
                  onClick={checkAnswer}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  확인
                </button>

                <div className="flex justify-between pt-1">
                  <button 
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="text-xs text-cyan-300/70 hover:text-cyan-300 disabled:opacity-40 transition-colors"
                  >
                    💡 힌트 (-50%)
                  </button>
                  <button 
                    onClick={skip}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    건너뛰기 (-5초) →
                  </button>
                </div>

                {showHint && (
                  <div className="text-center text-cyan-300 bg-cyan-500/15 rounded-xl py-2 border border-cyan-500/30 text-sm">
                    💡 {currentWord.hint}
                  </div>
                )}
              </div>
            </div>

            {feedback === "correct" && (
              <div className="text-center mt-3 text-xl animate-bounce text-emerald-400 font-bold">
                ✅ 정답!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
