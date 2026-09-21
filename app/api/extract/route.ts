import { NextRequest, NextResponse } from "next/server";
import { extractProfileStats, ExtractionError } from "@/lib/extract";
import { calcPerPostValue } from "@/lib/scoring";
import * as db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let stats;

    if (body.manual) {
      stats = {
        username: body.username || "unknown",
        followers: Number(body.followers) || 0,
        following: Number(body.following) || 0,
        posts: Number(body.posts) || 0,
        bio: body.bio || "",
        verified: false,
      };
    } else {
      if (!body.image || !body.mediaType) {
        return NextResponse.json(
          { error: "Missing image or mediaType" },
          { status: 400 }
        );
      }
      stats = await extractProfileStats(body.image, body.mediaType);
    }

    const score = calcPerPostValue(stats.followers);

    const submission = await db.create({
      ...stats,
      score,
      email: null,
    });

    return NextResponse.json(submission);
  } catch (error) {
    if (error instanceof ExtractionError) {
      return NextResponse.json(
        { error: "extraction_failed", message: error.message },
        { status: 422 }
      );
    }
    console.error("Extract error:", error);
    return NextResponse.json(
      { error: "server_error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
