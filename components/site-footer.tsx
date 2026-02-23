export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50">
      {/* Wave decoration */}
      <div className="absolute -top-px left-0 right-0 h-px bg-blue-500/50" />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-3">
              <img
                src="/assets/bsd-white.png"
                alt="BSD logo"
                className="h-10 w-auto opacity-90"
              />
              <div>
                <p className="text-lg font-bold text-white">바퍼 재믹스</p>
                <p className="text-xs text-white/50">by BSD Class</p>
              </div>
            </div>
            <p className="mt-2 max-w-xs text-center text-sm text-white/40 md:text-left">
              AI와 함께 만드는 무한한 게임의 세계
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <div className="text-center md:text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">Links</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li>
                  <a href="https://bsd-3.kit.com/kakao" target="_blank" rel="noopener noreferrer" 
                    className="transition-colors hover:text-blue-400">
                    바이브코딩 특강
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-blue-400">
                    인스타그램
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">Support</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li>
                  <a href="#" className="transition-colors hover:text-blue-400">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-blue-400">
                    게임 제안
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & CTA */}
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://bsd-3.kit.com/kakao" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-blue-500/40"
            >
              <span>바이브코딩 시작하기</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 md:flex-row">
          <p className="text-xs text-white/40">
            © 2026 BSD Class. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made with 💜 by @BSD_funneldding
          </p>
        </div>
      </div>
    </footer>
  );
}
