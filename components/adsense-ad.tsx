"use client";

export default function AdsenseAd() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-purple-500/5 p-1">
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 opacity-50 blur-xl" />
      
      <div className="relative rounded-xl bg-black/40 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* CTA Content */}
          <div className="text-center md:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"></span>
              특별 이벤트
            </div>
            <h3 className="text-lg font-bold text-white">
              🚀 AI 바이브코딩 무료 특강
            </h3>
            <p className="mt-1 text-sm text-white/60">
              코드 한 줄 몰라도 OK! AI와 함께 나만의 게임을 만들어보세요
            </p>
          </div>

          {/* CTA Button */}
          <a 
            href="https://bsd-3.kit.com/kakao" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40"
          >
            <span className="relative z-10">무료로 시작하기</span>
            <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>

      </div>
    </div>
  );
}
