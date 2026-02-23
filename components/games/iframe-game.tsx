"use client";

interface IframeGameProps {
  url: string;
  title: string;
}

export default function IframeGame({ url, title }: IframeGameProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md aspect-[9/16] sm:aspect-[3/4] bg-black rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
      >
        전체화면으로 열기 ↗
      </a>
    </div>
  );
}
