# World Cup Challenge ⚽

A modern interactive football quiz platform built around the FIFA World Cup 2026
(48 nations · 12 groups). Powered by Next.js 15 (App Router), TypeScript,
Tailwind CSS v4, custom shadcn-style primitives, Framer Motion and Lucide icons.

## ✨ Highlights

- **Dynamic quiz engine** — Every question is procedurally generated from the local
  `teams.ts` dataset: flag identification, team captain, FIFA ranking, continent
  and group draw. No hard-coded questions.
- **Five quiz modes** filterable via `/quiz?type=flag|captain|ranking|continent|group`.
- **Team-focused quizzes** via `/quiz?team={teamId}` — used on every team profile.
- **Daily Challenge** — a deterministic 10-question set seeded by the current date,
  so every visitor gets the same questions today.
- **Score · Streak · Timer** with combo bonuses (+25 per streak, +4 × seconds left).
- **High score** persisted to `localStorage` per mode.
- **Global leaderboard** (demo data) with gold/silver/bronze styling and accuracy bars.
- **Dark stadium UI** — neon green/cyan/violet accents, glassmorphism, animated
  floating flags, pitch grid, gradient typography.
- **Dark / Light theme toggle** persisted to `localStorage`.
- **Keyboard shortcuts**: `1–4` to answer, `Enter` / `Space` for next.
- **Confetti** on every 3-question streak. Football loader for async states.
- **Fully responsive** — mobile sidebar nav, fluid grids, touch-friendly buttons.

## 🛠 Tech stack

- [Next.js 15+ App Router](https://nextjs.org/) (React 19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Custom shadcn-style UI primitives (Button, Card, Badge, Input, Progress, Select)
- [Framer Motion](https://www.framer.com/motion/) for transitions, hover, layout
- [Lucide Icons](https://lucide.dev/)
- [Radix Slot](https://www.radix-ui.com/) (Button `asChild`)
- [flagcdn.com](https://flagcdn.com/) for placeholder flag images

## 📂 Folder structure

```
src/
├── app/                       # Next.js App Router pages
│   ├── layout.tsx             # Root layout (theme, nav, footer)
│   ├── page.tsx               # Home
│   ├── teams/
│   │   ├── page.tsx           # /teams (search + filter)
│   │   └── [id]/page.tsx      # /teams/[id]
│   ├── quiz/page.tsx          # /quiz?type=&team=
│   ├── leaderboard/page.tsx   # /leaderboard
│   └── daily-challenge/page.tsx
├── components/
│   ├── ui/                    # Button, Card, Badge, Input, Progress, Select
│   ├── layout/                # Navbar, Footer
│   ├── home/                  # Hero, Featured, Trending, Stats, Daily card
│   ├── teams/                 # TeamCard, TeamsExplorer, TeamHeroAnimation
│   ├── quiz/                  # QuizRunner, QuestionCard, ScoreBoard, ...
│   ├── leaderboard/           # LeaderboardTable, LeaderboardSummary
│   ├── theme-provider.tsx
│   ├── FloatingFlags.tsx
│   ├── FootballLoader.tsx
│   └── Confetti.tsx
├── data/
│   ├── teams.ts               # 48 FIFA WC 2026 nations
│   └── leaderboard.ts         # demo leaderboard rows
├── lib/
│   ├── utils.ts               # cn, shuffle, seededRandom, pickRandom, ...
│   └── generateQuestions.ts   # all dynamic question generators
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useCountdown.ts
│   └── useKeyboardShortcut.ts
└── types/
    └── index.ts               # Team, QuizQuestion, LeaderboardEntry, ...
```

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build      # production build
npm start          # serve the build
npm run lint       # eslint
```

## 🧠 How the quiz engine works

`src/lib/generateQuestions.ts` exposes generators for every quiz type. Each one
samples real teams from `src/data/teams.ts`, picks correct/distractor options,
shuffles them and assigns a per-type time limit.

```ts
import { generateQuiz, generateDailyChallenge } from "@/lib/generateQuestions";

const random = generateQuiz({ count: 10 });
const flagsOnly = generateQuiz({ count: 10, types: ["flag"] });
const daily = generateDailyChallenge(); // deterministic, seeded by today's date
```

The same `QuizRunner` component renders all of them — `/quiz` and
`/daily-challenge` are just thin wrappers passing different `questions` and
`storageKey` values.

## 🎮 Keyboard shortcuts

| Key            | Action                  |
| -------------- | ----------------------- |
| `1` – `4`      | Answer options          |
| `Enter` / `␣`  | Next question (when locked) |

## 📷 Image domain

The app uses [flagcdn.com](https://flagcdn.com/) for flag placeholders. The host
is whitelisted in `next.config.ts` under `images.remotePatterns`.

## 📝 License

Personal / educational use. Not affiliated with FIFA. Team data and rankings are
illustrative.
