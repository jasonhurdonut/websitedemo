"use client";

import { useState, useEffect, useRef } from "react";
import { formatDollar } from "@/lib/scoring";

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(score * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  return (
    <div className="text-center">
      <div className="text-7xl sm:text-8xl font-bold text-accent leading-none">
        {formatDollar(displayed)}
      </div>
      <div className="text-2xl text-zinc-400 mt-2">/post</div>
    </div>
  );
}
