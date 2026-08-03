import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <h1>404</h1>
      <p>这页还没有内容。</p>
      <Link href="/">回到首页</Link>
    </main>
  );
}
