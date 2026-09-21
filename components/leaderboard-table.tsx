import { Submission } from "@/lib/db";
import { formatDollar } from "@/lib/scoring";

interface LeaderboardTableProps {
  submissions: Submission[];
  highlightId?: string;
}

export default function LeaderboardTable({
  submissions,
  highlightId,
}: LeaderboardTableProps) {
  if (submissions.length === 0) {
    return (
      <p className="text-center text-zinc-400 py-12">
        No entries yet. Could be you.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-x-4 text-sm text-zinc-400 pb-3 border-b border-zinc-200 font-medium">
        <span>#</span>
        <span>Account</span>
        <span className="text-right">Followers</span>
        <span className="text-right">Value</span>
      </div>
      {submissions.map((sub, i) => (
        <div
          key={sub.id}
          className={`grid grid-cols-[3rem_1fr_auto_auto] gap-x-4 py-3 border-b border-zinc-100 items-center ${
            sub.id === highlightId ? "bg-accent/5 -mx-4 px-4 rounded-lg" : ""
          }`}
        >
          <span className="text-zinc-400 font-medium">{i + 1}</span>
          <span className="font-medium truncate">@{sub.username}</span>
          <span className="text-zinc-500 text-right text-sm">
            {new Intl.NumberFormat("en-US", { notation: "compact" }).format(
              sub.followers
            )}
          </span>
          <span className="text-accent font-semibold text-right">
            {formatDollar(sub.score)}
          </span>
        </div>
      ))}
    </div>
  );
}
