"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/constants";

interface ShareCardPreviewProps {
  submissionId: string;
  username: string;
}

export default function ShareCardPreview({
  submissionId,
  username,
}: ShareCardPreviewProps) {
  const [copied, setCopied] = useState(false);
  const ogUrl = `/api/og/${submissionId}`;
  const shareUrl = `${SITE_URL}/result/${submissionId}`;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ share_count_increment: true }),
    });
  }

  async function handleDownload() {
    const res = await fetch(ogUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toulc-${username}.png`;
    a.click();
    URL.revokeObjectURL(url);
    fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ share_count_increment: true }),
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden border border-zinc-200 mb-6">
        <img
          src={ogUrl}
          alt={`${username}'s Instagram value`}
          className="w-full"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleCopyLink}
          className="flex-1 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
        >
          {copied ? "Copied!" : "Copy share link"}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-3 rounded-xl border-2 border-accent text-accent font-medium hover:bg-accent/5 transition-colors"
        >
          Download for story
        </button>
      </div>
    </div>
  );
}
