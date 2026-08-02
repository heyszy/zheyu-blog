import type { Metadata } from "next";
import {
  Inter,
  La_Belle_Aurore,
  Libre_Caslon_Text,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const signature = La_Belle_Aurore({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "400",
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
    default: "Zheyu Shen",
    template: "%s — Zheyu Shen",
  },
  description: "关注 AI、产品与工程实践，记录新工具如何改变工作与创造。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zheyu.me",
    siteName: "Zheyu Shen",
    title: "Zheyu Shen",
    description: "关注 AI、产品与工程实践，记录新工具如何改变工作与创造。",
  },
  twitter: {
    card: "summary",
    title: "Zheyu Shen",
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
        {children}
      </body>
    </html>
  );
}
