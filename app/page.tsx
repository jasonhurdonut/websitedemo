"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/upload-zone";
import ProcessingScreen from "@/components/processing-screen";
import ManualFallback from "@/components/manual-fallback";

type State = "idle" | "processing" | "error";

export default function Home() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleUpload(base64: string, mediaType: string) {
    setState("processing");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "extraction_failed") {
          setErrorMsg(data.message);
          setState("error");
          return;
        }
        throw new Error(data.message || "Something went wrong");
      }

      router.push(`/result/${data.id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  async function handleManual(data: {
    username: string;
    followers: number;
    following: number;
    posts: number;
  }) {
    setState("processing");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manual: true, ...data }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      router.push(`/result/${result.id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <>
      {state === "processing" && <ProcessingScreen />}

      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            What is your Instagram{" "}
            <span className="text-accent">actually</span> worth?
          </h1>
          <p className="text-xl text-zinc-500 mb-12">
            Upload a screenshot. Get your number. See where you rank.
          </p>

          {state === "error" ? (
            <div>
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                {errorMsg}
              </div>
              <ManualFallback onSubmit={handleManual} />
              <button
                onClick={() => setState("idle")}
                className="mt-6 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Try uploading again
              </button>
            </div>
          ) : (
            <UploadZone onUpload={handleUpload} />
          )}

          <div className="mt-20 space-y-8 text-left">
            <h2 className="text-2xl font-bold">Three steps.</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="text-accent font-bold text-lg">1.</span>
                <p className="text-zinc-600">Screenshot your Instagram profile.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-accent font-bold text-lg">2.</span>
                <p className="text-zinc-600">Upload it.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-accent font-bold text-lg">3.</span>
                <p className="text-zinc-600">
                  See what brands would pay to work with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
