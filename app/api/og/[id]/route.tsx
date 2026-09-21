import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${siteUrl}/api/submissions/${id}`);
  if (!res.ok) {
    return new Response("Not found", { status: 404 });
  }
  const submission = await res.json();

  const score = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(submission.score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 48,
            color: "#7C3AED",
            fontWeight: 700,
            marginBottom: 60,
            letterSpacing: "0.1em",
          }}
        >
          toulc
        </div>

        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          {score}
        </div>

        <div
          style={{
            fontSize: 64,
            color: "#7C3AED",
            fontWeight: 400,
            marginBottom: 60,
          }}
        >
          /post
        </div>

        <div
          style={{
            fontSize: 48,
            color: "#a1a1aa",
            marginBottom: 20,
          }}
        >
          @{submission.username}
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#52525b",
            marginBottom: 120,
          }}
        >
          {new Intl.NumberFormat("en-US").format(submission.followers)} followers
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#7C3AED",
          }}
        >
          Find yours at toulc.com
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
