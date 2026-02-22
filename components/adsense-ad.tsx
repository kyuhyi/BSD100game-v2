"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdsenseAd() {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const el = adRef.current;
    if (!el) return;

    if (el.getAttribute("data-ad-pushed") === "1") return;

    try {
      el.setAttribute("data-ad-pushed", "1");
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      el.removeAttribute("data-ad-pushed");
      console.warn("AdSense push skipped:", err);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6884566372095161"
      data-ad-slot="3522719988"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
