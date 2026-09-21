import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_PATH = path.join(process.cwd(), "data", "submissions.json");

export interface Submission {
  id: string;
  created_at: string;
  email: string | null;
  username: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
  verified: boolean;
  score: number;
  share_count: number;
}

function readAll(): Submission[] {
  try {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAll(data: Submission[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function getAll(): Promise<Submission[]> {
  return readAll();
}

export async function getById(id: string): Promise<Submission | null> {
  const all = readAll();
  return all.find((s) => s.id === id) || null;
}

export async function create(
  data: Omit<Submission, "id" | "created_at" | "share_count">
): Promise<Submission> {
  const all = readAll();
  const submission: Submission = {
    ...data,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    share_count: 0,
  };
  all.push(submission);
  writeAll(all);
  return submission;
}

export async function update(
  id: string,
  data: Partial<Submission>
): Promise<Submission | null> {
  const all = readAll();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...data };
  writeAll(all);
  return all[index];
}

export async function getTopN(n: number): Promise<Submission[]> {
  const all = readAll();
  return all.sort((a, b) => b.score - a.score).slice(0, n);
}

export async function getRank(score: number): Promise<number> {
  const all = readAll();
  const higher = all.filter((s) => s.score > score).length;
  return higher + 1;
}
