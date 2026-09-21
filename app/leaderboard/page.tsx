import * as db from "@/lib/db";
import LeaderboardTable from "@/components/leaderboard-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const submissions = await db.getTopN(50);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          The Leaderboard
        </h1>
        <p className="text-zinc-500 mb-10">
          Top 50 most valuable Instagram accounts (so far).
        </p>

        <LeaderboardTable submissions={submissions} />

        <div className="text-center mt-16">
          <p className="text-zinc-400 mb-4">Want to see your name here?</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
          >
            Calculate your value
          </Link>
        </div>
      </div>
    </div>
  );
}
