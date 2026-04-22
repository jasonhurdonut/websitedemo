# Instagram Value Tool — Full Build Plan

*A viral lead-gen tool that scores how much an Instagram account is theoretically worth, builds a waitlist for a future checkout cashback product, and ships in one week.*

---

## 1. The Strategic Frame

**What this is:** A free web tool where users upload a screenshot of their Instagram profile and get back a personalized dollar-value score, a shareable result card, and a spot on a public leaderboard.

**What this is NOT:** The actual business. This is the top of the funnel. The real product — a checkout cashback feature where users post content in exchange for store credit — comes later. This tool exists to build the email list, learn what makes accounts "valuable," and generate distribution for the real launch.

**Why this framing matters for every decision below:** every feature should be evaluated against one question — *does this increase signups or shares?* Anything that doesn't directly serve that goal gets cut from v1.

**Success criteria for v1:**
- 1,000 email signups in 60 days
- 30%+ share rate (users who share their result to a story, post, or link)
- <10% screenshot extraction failure rate
- Working end-to-end flow deployed by end of week 1

---

## 2. Product Spec

### Core User Flow

1. **Landing page.** One input: "Find out what your Instagram is worth." CTA button: "Upload screenshot." Example screenshot shown so users know what to capture.
2. **Screenshot upload.** User uploads image of their Instagram profile page.
3. **Processing screen.** 2–3 second loading state with engaging copy ("Analyzing your reach... Calculating engagement value... Comparing against creator benchmarks..."). The perceived-effort illusion matters — instant results feel cheap.
4. **Result page.** Big dollar number ("$X per post"), their @handle, a breakdown of how it was calculated (follower score + engagement + niche), a shareable image auto-generated, a share button, and an email capture CTA: "Join the waitlist to actually earn this."
5. **Post-signup.** Confirmation screen with leaderboard position and a second share prompt ("You're #247 on the leaderboard — show your friends").
6. **Leaderboard page.** Top 50 accounts by score, publicly visible, updated live.

### Feature List (ship vs. cut)

**Ship in v1:**
- Screenshot upload with Claude vision extraction
- Dollar-value score with simple formula
- Auto-generated shareable result card (critical — virality lives here)
- Public leaderboard (top 50)
- Email capture for waitlist
- Copy share link / share to IG story button

**Cut from v1 (park for v2):**
- User accounts / login
- TikTok, X, YouTube support
- Historical score tracking
- Fraud detection on faked screenshots
- Niche-specific comparisons
- Paid premium scores
- OAuth verification

### The Scoring Formula

Keep this simple. The formula doesn't need to be correct, it needs to be believable and fun:

```
base_value = followers × engagement_rate_multiplier × niche_multiplier × $0.02
per_post_value = base_value
monthly_value = base_value × estimated_posts_per_month
```

**Defaults for v1:**
- `engagement_rate_multiplier` = 1.0 (can be tuned later when you estimate from visible likes)
- `niche_multiplier` = 1.0 (can be inferred from bio keywords as a fast upgrade)
- `estimated_posts_per_month` = 8 (industry average for active creators)

**Sample outputs to sanity-check:**
- 500 followers → ~$10/post
- 5,000 followers → ~$100/post
- 50,000 followers → ~$1,000/post
- 500,000 followers → ~$10,000/post

These feel right. Real creator CPMs support these numbers. Users will find them aspirational-but-not-absurd, which is the viral sweet spot.

### The Share Card (the most important feature)

Auto-generated PNG, 1080×1920 (IG story dimensions). Elements:
- Big centered number: "$X/post"
- Their @handle underneath
- Subtle tag: "mine.value" (or whatever you name it) at the bottom
- Clean aesthetic — high contrast, one accent color, large serif or geometric sans typography

Use `@vercel/og` or `next/og` to generate on the fly from a URL like `/share/[userId].png`. When users hit "share to IG story," they download this image and post it. The URL watermark drives traffic back.

### Email Capture Copy

Don't be coy about what the waitlist is for:

> "You could actually earn this. We're launching a way to get cashback on products from brands you love — by sharing them. Join the waitlist."

Button: "Join waitlist." No password, no confirmation email required beyond a double-opt-in for compliance.

---

## 3. Branding & Positioning

### Name

You need a short, ownable, single-word-or-two name. Some directions:

- *Worth* — too generic, probably taken
- *Clout Index* — old vibe, but punchy
- *Grid* — references IG visual, simple, probably ownable as a subdomain
- *Paycheck* — witty, plays on "what's your Instagram paycheck"
- *mint.* — double meaning (mint money, mint condition)

Pick anything that works. Don't spend more than an hour on this. Register the .com or .co if available. Naming is a procrastination trap.

### Tone

Confident, slightly cheeky, not corporate. Examples:

- Landing: "Find out how much your Instagram is actually worth. Spoiler: it's more than you think."
- Result page: "Your Instagram is worth **$247 per post.**"
- Empty leaderboard slot: "Could be you."

Avoid: anything that sounds like a SaaS homepage. No "revolutionize," no "empower creators," no stock illustrations of diverse friend groups looking at a phone.

### Visual Design

One accent color + black + white. Large type. Lots of whitespace. Think Perplexity, character.ai, or early Robinhood — confident minimalism, not overworked.

---

## 4. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Fast, standard, deploys to Vercel in one click |
| Hosting | Vercel | Free tier covers your scale, preview URLs for iteration |
| Database | Supabase (Postgres) | Free tier, simple, includes file storage if needed |
| Styling | Tailwind CSS | Speed, consistency, no CSS debates |
| Vision/AI | Anthropic API (Claude Haiku 4.5 with vision) | Cheap, fast, accurate for screenshot extraction |
| Share image gen | `@vercel/og` | Built for exactly this use case |
| Analytics | Vercel Analytics + Plausible | Free/cheap, privacy-friendly |
| Email collection | Supabase table + Resend for sending | No need for Mailchimp yet |
| Domain | Namecheap | ~$12/yr |

**Total monthly cost at MVP scale:** ~$5–15 (Anthropic API credits) + $12/yr domain. Everything else is free tier.

### The Claude Extraction Call

```javascript
const response = await anthropic.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 500,
  messages: [{
    role: "user",
    content: [
      {
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: base64Image }
      },
      {
        type: "text",
        text: `Extract Instagram profile stats from this screenshot. Return ONLY a JSON object with this exact shape:
{
  "username": string,
  "followers": integer,
  "following": integer,
  "posts": integer,
  "bio": string,
  "verified": boolean
}
Convert "4.2M" to 4200000, "15.3k" to 15300. If any field is not visible, use null. Do not include any text outside the JSON.`
      }
    ]
  }]
});
```

Parse the JSON from `response.content[0].text`. Wrap in try/catch — if parsing fails, show the user a "couldn't read screenshot, try again" error.

### Database Schema

One table is enough for v1:

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text,
  username text,
  followers int,
  following int,
  posts int,
  bio text,
  verified boolean,
  score numeric,
  share_count int default 0
);

create index idx_score on submissions(score desc);
```

Leaderboard query: `select username, score from submissions order by score desc limit 50`.

---

## 5. Landing Page Copy

**Hero:**
> # What is your Instagram actually worth?
> Upload a screenshot. Get your number. See where you rank.
> 
> [ Upload Screenshot ]

**Sub-section 1 — how it works:**
> ### Three steps.
> 1. Screenshot your Instagram profile.
> 2. Upload it.
> 3. See what brands would pay to work with you.

**Sub-section 2 — social proof (fill in as you grow):**
> *"I had no idea my account was worth $150 per post. Already got a brand deal."* — @user
> 
> Join 1,247 creators who've calculated their worth.

**Sub-section 3 — what's next:**
> ### This is just the score.
> We're building a way to actually earn it. Join the waitlist to get cashback on products from brands you love — just by sharing them.
> 
> [ Join Waitlist ]

**Footer:** privacy policy, contact email, one sentence about who built it.

---

## 6. Day-by-Day Build Plan

### Day 1 (Saturday) — Setup & scaffolding
- Buy domain (1 hour max on naming)
- Create Next.js 14 project with App Router
- Deploy blank page to Vercel
- Set up Supabase project, create `submissions` table
- Get Anthropic API key, store in Vercel env vars
- Get Tailwind installed and a basic color palette chosen

**End-of-day checkpoint:** live URL, empty homepage, database ready.

### Day 2 (Sunday) — Core extraction flow
- Build upload component (file input, preview, client-side compression)
- API route `/api/extract` that takes image, calls Claude, returns parsed JSON
- Score calculator function
- Store result in Supabase
- Ugly but functional result page showing the extracted data + score

**End-of-day checkpoint:** upload a screenshot, see a score. UI can be hideous.

### Day 3 (Monday) — Result page design
- Redesign result page to look actually good — big number, clean type, your color palette
- Build the share card generator with `@vercel/og`
- Implement "copy share link" and "download story image" buttons
- Add email capture field

**End-of-day checkpoint:** a result page you'd be proud to send to a friend.

### Day 4 (Tuesday) — Leaderboard + landing page
- Build `/leaderboard` page pulling top 50 from Supabase
- Build proper landing page using the copy from section 5
- Add the example screenshot image to the upload flow
- Hook up Vercel Analytics

**End-of-day checkpoint:** entire site navigable, all three main pages polished.

### Day 5 (Wednesday) — Polish + edge cases
- Handle extraction failures gracefully (retry button, "try a clearer screenshot" message)
- Test with ~20 different real screenshots (use friends' accounts)
- Fix the worst 3 UI bugs
- Write privacy policy (use Termly or a template — 30 minutes max)
- Add favicon, OG image for link previews

**End-of-day checkpoint:** would-be-embarrassed-to-ship bar cleared.

### Day 6 (Thursday) — Soft launch
- Send to 10 friends, get real feedback
- Fix whatever they find confusing
- Prepare launch copy for your own channels

**End-of-day checkpoint:** 10 real uses with no catastrophic bugs.

### Day 7 (Friday) — Launch
- Post to your own IG story with your score
- Post in Cornell Sidechat, relevant group chats, sorority GCs if you have access
- DM it to 20 people with the highest follower counts you know (they'll get high scores, which makes them more likely to share)
- Submit to Product Hunt for the next day
- Monitor for bugs, be responsive

**End-of-day checkpoint:** 50+ signups by end of day.

---

## 7. Growth Playbook (weeks 2–8)

### Week 2: Cornell saturation
- Partner with 2–3 Cornell influencers (people with 5k+ followers on campus) — give them a private preview, ask for a story post
- Post in every Cornell-adjacent group chat, GroupMe, Discord you have access to
- Target: 200 signups

### Week 3: Adjacent schools
- Reach out to friends at Penn, Columbia, NYU, Harvard — ask them to share in their networks
- Post to r/college, r/InstagramMarketing (carefully, not spammy)
- Target: 500 signups

### Week 4: Creator economy niche communities
- Post to creator-economy Twitter, LinkedIn, relevant Discord servers
- DM 20 creator economy newsletter writers (Passionfruit, Creator Economy Report, etc.)
- Target: 1,000 signups

### Week 5–8: Optimize and prepare v2
- A/B test the result page copy
- Add niche detection (parse bio, adjust niche multiplier)
- Start brand outreach using your waitlist as proof: "We have 1,000+ creators with an average of X followers, interested in cashback deals. Want to pilot?"
- Begin building the actual checkout cashback MVP

---

## 8. What Could Kill This (honest risk assessment)

**Risk 1: Screenshots fail to parse reliably.**  
Mitigation: test 20+ real screenshots before launch. Build a manual fallback (user types in their numbers) for edge cases.

**Risk 2: Nobody shares.**  
Mitigation: the share card *must* look great. If v1 shares are under 20%, redesign the card before spending on ads or outreach.

**Risk 3: Users sign up but the waitlist feels hollow when you email them months later.**  
Mitigation: send a weekly update email starting week 2. Show them what you're building. Don't let the list go cold.

**Risk 4: You get distracted and don't ship the checkout product.**  
This is the biggest risk. This tool has zero value without the downstream product. Put a deadline on the calendar now — by month 3, checkout MVP must be in pilot with at least one brand.

**Risk 5: Instagram sends a cease and desist.**  
Extremely unlikely for a screenshot-based tool (users are voluntarily uploading their own content). Not a real concern at your scale. Worry about this at 100k users, not 1k.

---

## 9. The Meta-Point

You are not building a scoring tool. You are running a marketing experiment disguised as a product. Every decision flows from this:

- The scoring formula doesn't need to be accurate, it needs to be plausible and shareable.
- The design matters more than the engineering, because shares depend on how the result card looks.
- The email capture is the actual product — everything else is customer acquisition.
- Shipping on day 7 matters more than shipping something better on day 21.

Ship ugly, ship fast, learn from real user behavior, iterate. The version that goes viral will not be the version you imagined.

---

## 10. Immediate Next Actions (do today)

1. Decide on a name (30 minutes, no more)
2. Buy the domain
3. Create the Next.js project, deploy a blank page to Vercel
4. Create Supabase project and the `submissions` table
5. Get Anthropic API credits ($5 is enough for launch)

If you can't do these five things in the next two hours, the project won't ship. If you can, you're 20% of the way to launch already.
