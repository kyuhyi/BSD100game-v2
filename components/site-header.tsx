export default function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/15 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src="/assets/bsd-white.png" alt="BSD logo" className="h-8 w-auto" />
          <span className="text-sm font-semibold text-white/90">바퍼 재믹스</span>
        </div>
      </div>
    </header>
  );
}
