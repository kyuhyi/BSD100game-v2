"use client";

import { useEffect } from "react";

interface GoogleAdProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function GoogleAd({ 
  slot, 
  format = "auto",
  style,
  className = ""
}: GoogleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-6884566372095161"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// 상단 광고
export function TopAd() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-4">
      <GoogleAd slot="5852507459" format="horizontal" />
    </section>
  );
}

// 중단 광고 (게임 사이)
export function MiddleAd() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-4">
      <GoogleAd slot="5852507459" format="auto" />
    </section>
  );
}

// 하단 광고
export function BottomAd() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-4">
      <GoogleAd slot="5852507459" format="horizontal" />
    </section>
  );
}
