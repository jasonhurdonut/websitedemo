import { notFound } from "next/navigation";
import * as db from "@/lib/db";
import ScoreDisplay from "@/components/score-display";
import ScoreBreakdown from "@/components/score-breakdown";
import ShareCardPreview from "@/components/share-card-preview";
import EmailCapture from "@/components/email-capture";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await db.getById(id);
  if (!submission) notFound();

  const rank = await db.getRank(submission.score);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-16">
      <div className="max-w-lg mx-auto space-y-12 text-center">
        <div>
          <p className="text-zinc-500 mb-4">Your Instagram is worth</p>
          <ScoreDisplay score={submission.score} />
          <p className="text-lg text-zinc-400 mt-4">
            @{submission.username}
            {submission.verified && (
              <span className="ml-1 text-accent">&#10003;</span>
            )}
          </p>
        </div>

        <ScoreBreakdown submission={submission} />

        <div>
          <h2 className="text-xl font-bold mb-6">Share your score</h2>
          <ShareCardPreview
            submissionId={submission.id}
            username={submission.username}
          />
        </div>

        <div className="pt-4 border-t border-zinc-100">
          <EmailCapture submissionId={submission.id} rank={rank} />
        </div>
      </div>
    </div>
  );
}
