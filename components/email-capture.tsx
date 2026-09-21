"use client";

import { useState } from "react";

interface EmailCaptureProps {
  submissionId: string;
  rank: number;
}

export default function EmailCapture({ submissionId, rank }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl font-bold mb-2">You&apos;re #{rank} on the leaderboard</p>
        <p className="text-zinc-500">
          We&apos;ll let you know when you can actually cash out.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <p className="text-lg font-medium mb-1">You could actually earn this.</p>
      <p className="text-zinc-500 text-sm mb-6">
        We&apos;re launching a way to get cashback from brands you love — by sharing them. Join the waitlist.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Join"}
        </button>
      </form>
    </div>
  );
}
