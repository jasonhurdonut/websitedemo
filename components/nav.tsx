import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-accent transition-colors"
        >
          toulc
        </Link>
        <Link
          href="/leaderboard"
          className="text-sm text-zinc-500 hover:text-foreground transition-colors"
        >
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}
