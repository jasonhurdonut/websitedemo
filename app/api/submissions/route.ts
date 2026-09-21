import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET() {
  const top = await db.getTopN(50);
  return NextResponse.json(top);
}
