import Link from "next/link";
import { notFound } from "next/navigation";
import LocalGamePlayer from "@/components/local-game-player";
import { getGameById } from "@/lib/game-catalog";

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = getGameById(id);
  if (!game) notFound();

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] px-4 py-8 text-white">
      <div className="mx-auto mb-5 w-full max-w-3xl">
        <Link href="/" className="text-sm text-cyan-300 hover:underline">← 목록으로</Link>
      </div>
      <LocalGamePlayer game={game} />
    </main>
  );
}
