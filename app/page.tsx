import Demo from "@/components/demo";
import GameGrid from "@/components/game-grid";
import AdsenseAd from "@/components/adsense-ad";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function Page() {
  return (
    <main className="w-full">
      <SiteHeader />
      <Demo />
      <section className="mx-auto w-full max-w-5xl px-6 py-6">
        <AdsenseAd />
      </section>
      <GameGrid />
      <section className="mx-auto w-full max-w-5xl px-6 pb-6">
        <AdsenseAd />
      </section>
      <SiteFooter />
    </main>
  );
}
