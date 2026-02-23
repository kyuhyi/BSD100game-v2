import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "바퍼 재믹스",
  description: "바퍼 재믹스 - 100가지 게임을 하나로! 클래식 아케이드부터 퍼즐까지",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  openGraph: {
    title: "바퍼 재믹스",
    description: "바퍼 재믹스 - 100가지 게임을 하나로! 클래식 아케이드부터 퍼즐까지",
    url: "https://bsd100game-v2.vercel.app",
    siteName: "바퍼 재믹스",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "바퍼 재믹스"
      }
    ],
    locale: "ko_KR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "바퍼 재믹스",
    description: "바퍼 재믹스 - 100가지 게임을 하나로!",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.css" />
        {/* Google AdSense 자동 광고 */}
        <Script
          id="adsense-auto-ads"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6884566372095161"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-6884566372095161" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
