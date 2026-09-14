# World Cup 2026

A FIFA World Cup 2026 companion app — **48 nations · 12 groups · full schedule · knockout bracket · quizzes · Best XI**. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Lucide icons.

Kickoff times are shown in **Bangladesh Standard Time (UTC+6)**.

## Features

### Tournament & fixtures
- **Home hero** — live/next match focus; when the final is finished, celebrates the champion
- **Full schedule** — 72 group-stage matches plus knockout (R32 → Final), with venues and BST kickoffs
- **Match detail pages** — scorelines, AET / penalties when applicable
- **Group standings** — points, GD, form; third-place ranking table for the best 8 advancers
- **Knockout fixtures** — Round of 32 through the Final and third-place play-off
- **Official tournament results** (`/predictions`) — locked read-only bracket: group standings, third-place advancers, and knockout winners through the Final

### Teams & rankings
- **48 national teams** — search and filter by group / continent
- **Team profiles** — squads, World Cup history, and team-focused quizzes
- **FIFA rankings** — live men’s rankings with confederation filters
- **Host venues** — USA / Mexico / Canada stadiums
- **All-time winners** — champions list including WC 2026

### Interactives
- **Best XI builder** — formations, pitch lineup, squads from all 48 nations (saved in `localStorage`)
- **Dynamic quiz engine** — questions generated from team data (flag, captain, ranking, continent, group)
- **Quiz modes** — `/quiz?type=flag|captain|ranking|continent|group` and `/quiz?team={id}`
- **Daily Challenge** — deterministic 10-question set seeded by the date
- **Score · streak · timer** with combo bonuses; high scores per mode in `localStorage`
- **Leaderboard** — demo global rankings UI

### UX
- Dark stadium UI with theme toggle (persisted)
- Responsive layout + mobile tab bar
- Keyboard shortcuts on quizzes (`1–4` answer, `Enter` / `Space` next)
- Confetti on quiz streaks; SEO metadata and Open Graph

## Tech stack

- [Next.js](https://nextjs.org/) App Router (React 19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Custom shadcn-style UI (Button, Card, Badge, Input, Progress, Select)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [flagcdn.com](https://flagcdn.com/) for flags
- Optional live data via football-data / FIFA rankings APIs (with local fixture overrides)

## Pages

| Route | Description |
| ----- | ----------- |
| `/` | Home — hero, standings, winners, venues, featured teams, quizzes |
| `/fixtures` | Full match schedule & standings explorer |
| `/fixtures/[id]` | Match detail |
| `/teams` | Browse 48 nations |
| `/teams/[id]` | Team profile & squad |
| `/predictions` | Official tournament results (locked bracket) |
| `/best-11` | Best XI pitch builder |
| `/rankings` | FIFA world rankings |
| `/groups` | Group overview |
| `/venues` | Host stadiums |
| `/winners` | World Cup champions |
| `/quiz` | Quiz modes |
| `/daily-challenge` | Daily 10-question challenge |
| `/leaderboard` | Quiz leaderboard |

## Folder structure

```
src/
├── app/                    # App Router pages
├── components/
│   ├── home/               # Hero, standings, winners, venues, quizzes
│   ├── fixtures/           # Schedule, standings, knockout, match detail
│   ├── predictions/        # Official results bracket (read-only)
│   ├── best-eleven/        # Pitch formation builder
│   ├── teams/              # Team cards, explorer, squads
│   ├── quiz/               # Quiz runner & daily challenge
│   ├── rankings/           # Rankings explorer
│   ├── leaderboard/
│   ├── layout/             # Navbar, footer, mobile tab bar
│   └── ui/                 # Shared primitives
├── data/
│   ├── teams.ts            # 48 WC 2026 nations
│   ├── fixtures/           # Group stage + knockout fixtures
│   ├── venues.ts           # Host stadiums
│   ├── world-cup-winners.ts
│   └── match-results/      # Manual score / detail overrides
├── lib/
│   ├── match-service.ts    # Fixture enrichment
│   ├── group-standings.ts  # Standings + third-place ranking
│   ├── official-tournament-results.ts
│   ├── predictions.ts      # Bracket helpers
│   ├── generateQuestions.ts
│   ├── fifa-rankings.ts
│   └── seo.ts
├── hooks/
└── types/
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve the build
npm run lint    # eslint
```

Optional env (see `src/config/`): site URL, Google Analytics, API keys for live rankings / match data.

## Quiz engine

`src/lib/generateQuestions.ts` builds questions from `src/data/teams.ts` — samples teams, distractors, and per-type timers.

```ts
import { generateQuiz, generateDailyChallenge } from "@/lib/generateQuestions";

const random = generateQuiz({ count: 10 });
const flagsOnly = generateQuiz({ count: 10, types: ["flag"] });
const daily = generateDailyChallenge(); // same set for everyone today
```

## Keyboard shortcuts (quiz)

| Key | Action |
| --- | ------ |
| `1` – `4` | Select answer |
| `Enter` / `Space` | Next question (when locked) |

## Images

Flags load from [flagcdn.com](https://flagcdn.com/) (whitelisted in `next.config.ts` under `images.remotePatterns`).

## License

Personal / educational use. Not affiliated with FIFA. Tournament data may mix official structure, local overrides, and illustrative content.
