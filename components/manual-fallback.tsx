"use client";

import { useState } from "react";

interface ManualFallbackProps {
  onSubmit: (data: {
    username: string;
    followers: number;
    following: number;
    posts: number;
  }) => void;
}

export default function ManualFallback({ onSubmit }: ManualFallbackProps) {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [posts, setPosts] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      username,
      followers: Number(followers),
      following: Number(following),
      posts: Number(posts),
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <p className="text-center text-zinc-500 mb-6">
        Couldn&apos;t read your screenshot. Enter your stats manually:
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username (without @)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <input
          type="number"
          placeholder="Followers"
          value={followers}
          onChange={(e) => setFollowers(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <input
          type="number"
          placeholder="Following"
          value={following}
          onChange={(e) => setFollowing(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <input
          type="number"
          placeholder="Posts"
          value={posts}
          onChange={(e) => setPosts(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
        >
          Calculate my value
        </button>
      </form>
    </div>
  );
}
