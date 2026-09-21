import {
  BASE_RATE,
  DEFAULT_ENGAGEMENT_MULTIPLIER,
  DEFAULT_NICHE_MULTIPLIER,
  POSTS_PER_MONTH,
} from "./constants";

export function calcPerPostValue(
  followers: number,
  engagementMultiplier: number = DEFAULT_ENGAGEMENT_MULTIPLIER,
  nicheMultiplier: number = DEFAULT_NICHE_MULTIPLIER
): number {
  return Math.round(followers * engagementMultiplier * nicheMultiplier * BASE_RATE * 100) / 100;
}

export function calcMonthlyValue(perPostValue: number): number {
  return Math.round(perPostValue * POSTS_PER_MONTH * 100) / 100;
}

export function formatDollar(amount: number): string {
  if (amount < 1) return `$${amount.toFixed(2)}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
