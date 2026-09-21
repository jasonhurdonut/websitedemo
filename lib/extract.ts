import Anthropic from "@anthropic-ai/sdk";

export interface ProfileStats {
  username: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
  verified: boolean;
}

export class ExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtractionError";
  }
}

const client = new Anthropic();

export async function extractProfileStats(
  base64Image: string,
  mediaType: string
): Promise<ProfileStats> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/png"
                | "image/jpeg"
                | "image/gif"
                | "image/webp",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `Extract the Instagram profile stats from this screenshot. Return ONLY valid JSON with these exact fields:
{
  "username": "the @handle without the @",
  "followers": number (convert "1.2M" to 1200000, "5.4K" to 5400, etc),
  "following": number,
  "posts": number,
  "bio": "the bio text or empty string",
  "verified": true/false
}
No markdown, no explanation, just the JSON object.`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text);
    return {
      username: parsed.username || "unknown",
      followers: Number(parsed.followers) || 0,
      following: Number(parsed.following) || 0,
      posts: Number(parsed.posts) || 0,
      bio: parsed.bio || "",
      verified: Boolean(parsed.verified),
    };
  } catch {
    throw new ExtractionError(
      "Could not parse Instagram data from screenshot. Try a clearer screenshot."
    );
  }
}
