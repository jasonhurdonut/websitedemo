"use client";

import { useState, useEffect } from "react";
import { LOADING_MESSAGES } from "@/lib/constants";

export default function ProcessingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      <div className="mb-8">
        <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
      </div>
      <p className="text-xl text-white font-medium">
        {LOADING_MESSAGES[index]}
      </p>
    </div>
  );
}
