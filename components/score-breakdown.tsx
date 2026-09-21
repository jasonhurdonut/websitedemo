import { formatDollar, calcMonthlyValue } from "@/lib/scoring";
import { Submission } from "@/lib/db";

interface ScoreBreakdownProps {
  submission: Submission;
}

export default function ScoreBreakdown({ submission }: ScoreBreakdownProps) {
  const rows = [
    {
      label: "Followers",
      value: new Intl.NumberFormat("en-US").format(submission.followers),
    },
    { label: "Engagement multiplier", value: "1.0x" },
    { label: "Niche multiplier", value: "1.0x" },
    { label: "Per post value", value: formatDollar(submission.score), highlight: true },
    {
      label: "Monthly value (8 posts)",
      value: formatDollar(calcMonthlyValue(submission.score)),
      highlight: true,
    },
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex justify-between py-3 border-b border-zinc-100 ${
            row.highlight ? "font-semibold" : "text-zinc-500"
          }`}
        >
          <span>{row.label}</span>
          <span className={row.highlight ? "text-accent" : ""}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
