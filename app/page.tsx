import Demo from "@/components/demo";
import GameGrid from "@/components/game-grid";
import AdsenseAd from "@/components/adsense-ad";
import { TopAd, MiddleAd, BottomAd } from "@/components/google-ad";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function Page() {
  return (
    <main className="w-full">
      <SiteHeader />
      
      {/* 상단 광고 */}
      <TopAd />
      
      <Demo />
      
      {/* 홍보 배너 */}
      <section className="mx-auto w-full max-w-5xl px-6 py-6">
        <AdsenseAd />
      </section>
      
      {/* 중단 광고 */}
      <MiddleAd />
      
      <GameGrid />
      
      {/* 하단 광고 */}
      <BottomAd />
      
      <SiteFooter />
    </main>
  );
}
