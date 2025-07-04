# SpeechFight – Functional Specification

_Last updated: June 28 2025_



---

## 1. Product Vision
SpeechFight is a **turn-based, voice-centric social network for civil debate**.  Each reply inside a thread starts a **60-minute cooldown** for the author, forcing reflection and discouraging dog-piling.  Users can post short text or voice clips; voice is automatically transcribed with OpenAI Whisper and accompanied by a live avatar halo that visualises vocal intensity.

Success for SpeechFight is measured by:
• Average daily debates created
• % of replies that are voice
• Completion rate of 3-turn exchanges
• Sentiment score of debates (toxicity < 0.35)

---

## 2. Core Features
| # | Capability | Description |
|---|---|---|
|F-1|Turn-based Cooldown|Posting inside a debate thread sets a per-user, per-thread cooldown key (`unlock_at`) for 60 minutes. UI shows live countdown and disables composer.|
|F-2|Voice Recording & Playback|In-browser MediaRecorder captures ≤30 s Opus/WebM; upload to Supabase Storage; auto-transcribe via Whisper; preview player with transcript.|
|F-3|Avatar Halo|While a voice clip plays, speaker’s avatar glows and scales based on real-time amplitude (Web Audio API + Framer Motion).|
|F-4|Targeted Challenges|Debate creators can tag users or groups; tagged users receive notifications & acceptance CTA.|
|F-5|Searchable Transcripts|Full-text index over transcripts enables keyword search across posts.|
|F-6|Moderation|Profanity & policy check via OpenAI Moderation; report flow; RLS in DB; per-hash audio re-upload detection.|

---

## 3. Architecture Overview
```
+-----------------+        Edge (Vercel)
| Next.js 14 App  |<------------------------------------+
|  (App Router)   |                                     |
+--------+--------+                                     |
         | SSR/API                                  WebSockets
         v                                              |
+--------+--------+             +--------------+        |
|  Supabase Postg |<-- Prisma -->|  Redis (Up)  |<-+    |
|  debates, posts |             | cooldown TTL |  |    |
+-----------------+             +--------------+  |    |
         ^                                        |    |
         |          Background queue              |    |
         |        (Vercel Cron / AWS Lambda)      |    |
         +-------------+--------------------------+    |
                       |                               |
                       v                               |
                +--------------+                       |
                | Whisper Job  |                       |
                |  ffmpeg +    |                       |
                |  OpenAI API  |-----------------------+
                +--------------+
```

---

## 4. Data Model
```sql
-- users table managed by Supabase Auth

create table public.debates (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  created_by    uuid references auth.users(id) on delete cascade,
  created_at    timestamptz default now()
);

create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  debate_id       uuid references public.debates(id) on delete cascade,
  parent_post_id  uuid references public.posts(id) on delete cascade,
  author_id       uuid references auth.users(id) on delete cascade,
  content_text    text,
  audio_url       text,
  transcript      text,
  created_at      timestamptz default now()
);

create table public.cooldowns (
  user_id     uuid,
  debate_id   uuid,
  unlock_at   timestamptz not null,
  primary key (user_id, debate_id)
);
```

---

## 5. API / Server Actions
| Method | Path | Purpose |
|---|---|---|
|POST|`/api/debates`|Create new debate (F-4 tagging optional).|
|GET |`/api/debates`|Paginated list for feed.|
|POST|`/api/debates/:id/reply`|Create post; performs cooldown guard (F-1).|
|GET |`/api/debates/:id`|SSR fetch of debate + posts.|
|POST|`/api/upload`|Stream voice blob to storage, return public URL (F-2).|

All endpoints require JWT cookies set by Supabase Auth.

---

## 6. Front-End Routes & Components
```
/                  – Marketing + feature grid (hero, CTAs)
/debates           – Timeline of debates
/debates/new       – Start debate form
/debates/[id]      – Thread view (posts, halo, cooldown)
```
Component highlights:
• `VoiceRecorder` – handles MediaRecorder, upload
• `VoicePlayer` – audio element + halo analyser
• `CooldownTimer` – live countdown display
• `AuthButton` – login / profile menu

---

## 7. Non-Functional Requirements
| Category | Target |
|---|---|
|Performance|SSR TTFB < 200 ms p95; Redis cooldown lookup < 3 ms.|
|Scalability|Horizontally scale WebSocket & worker tiers at 1 k concurrent debates.|
|Accessibility|WCAG 2.1 AA; captions for all voice clips.|
|Security|RLS on all tables; rate-limit 30 posts/hr/user; no PII in logs.|
|Compliance|GDPR delete within 30 days; age 13+ users only.|

---

## 8. Dev Ops & Tooling
• **CI** – GitHub Actions: lint, test, Type-check, Lighthouse, deploy preview.
• **CD** – Vercel production promotion after green main.
• **Observability** – Sentry (front & back), Logtail, k6 load test gate.
• **Infra-as-code** – Supabase migrations checked into `/supabase/migrations`.

---

## 9. Roadmap (MVP → Beta)
| Sprint | Milestone |
|---|---|
|0|Repo bootstrap, CI, auth flow|
|1|Data schema, create/list debates (text only)|
|2|Cooldown guard + client countdown|
|3|Voice recorder, upload, playback|
|4|Whisper transcription worker + transcript UI|
|5|Avatar halo + polish, mobile design|
|6|Moderation tools, report flow, public beta|

---

## 10. Open Questions
1. Cooldown duration adjustable by thread owner?
2. Voice length hard-limit (currently 30 s) – should premium users get longer?
3. Gamification (leaderboards, badges) in scope for V1?

---

_SpeechFight aims to raise the discourse level online by injecting **time, tone, and transparency** into every argument._

SpeechFight is an app about debating eachother in a turn based way....
