import type { Metadata } from "next";
import {
  Caveat,
  Inter,
  Libre_Caslon_Text,
} from "next/font/google";
import { PageMotionProvider } from "@/components/PageMotion";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const signature = Caveat({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const serif = Libre_Caslon_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zheyu.me"),
  title: {
    default: "Zheyu",
    template: "%s — Zheyu",
  },
  description: "关注 AI、产品与工程实践，记录新工具如何改变工作与创造。",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zheyu.me",
    siteName: "Zheyu",
    title: "Zheyu",
    description: "关注 AI、产品与工程实践，记录新工具如何改变工作与创造。",
  },
  twitter: {
    card: "summary",
    title: "Zheyu",
    description: "关注 AI、产品与工程实践，记录新工具如何改变工作与创造。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${signature.variable} ${serif.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          跳到正文
        </a>
        <PageMotionProvider>{children}</PageMotionProvider>
      </body>
    </html>
  );
}
