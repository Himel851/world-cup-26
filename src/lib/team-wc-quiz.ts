import { TEAM_WC_PROFILES, type TeamWcProfile } from "@/data/team-wc-profiles";
import type { Team } from "@/types";
import { pickN, shuffle } from "./utils";

export type TeamHistoryQuestion = {
  prompt: string;
  correctAnswer: string;
  distractors: string[];
};

const LAST_CHAMPION = { country: "Argentina", year: 2022 };

function yearOptions(correct: number): string[] {
  const pool = [
    correct,
    correct - 4,
    correct + 4,
    correct - 8,
    correct + 8,
    2010,
    2014,
    2018,
    2006,
    2002,
  ]
    .filter((y) => y >= 1930 && y <= 2026)
    .filter((y, i, a) => a.indexOf(y) === i);
  const wrong = pool.filter((y) => y !== correct).slice(0, 3);
  while (wrong.length < 3) wrong.push(1990 + wrong.length * 4);
  return wrong.map(String);
}

function nameOptions(correct: string, pool: string[]): string[] {
  return pool.filter((n) => n !== correct).slice(0, 3);
}

function buildFromProfile(team: Team, p: TeamWcProfile): TeamHistoryQuestion[] {
  const { name } = team;
  const out: TeamHistoryQuestion[] = [];

  if (p.titles > 0) {
    const lastWin = p.titleYears[p.titleYears.length - 1]!;
    out.push({
      prompt: `In which year did ${name} win the FIFA World Cup?`,
      correctAnswer: String(lastWin),
      distractors: yearOptions(lastWin),
    });
    out.push({
      prompt: `How many World Cup titles has ${name} won?`,
      correctAnswer: String(p.titles),
      distractors: nameOptions(String(p.titles), ["0", "1", "2", "3", "4", "5"]),
    });
    if (p.finalWinOver) {
      out.push({
        prompt: `Who did ${name} beat in the ${lastWin} World Cup final?`,
        correctAnswer: p.finalWinOver,
        distractors: nameOptions(p.finalWinOver, [
          "Brazil",
          "Germany",
          "France",
          "Italy",
          "England",
          "Netherlands",
        ]),
      });
    }
    if (p.wonInHost) {
      out.push({
        prompt: `Which country hosted the World Cup when ${name} won in ${lastWin}?`,
        correctAnswer: p.wonInHost,
        distractors: nameOptions(p.wonInHost, [
          "Germany",
          "Brazil",
          "France",
          "Qatar",
          "Russia",
          "South Africa",
        ]),
      });
    }
    if (p.winningManager) {
      out.push({
        prompt: `Who managed ${name} to World Cup glory in ${lastWin}?`,
        correctAnswer: p.winningManager,
        distractors: nameOptions(p.winningManager, [
          "Pep Guardiola",
          "Jürgen Klopp",
          "Carlo Ancelotti",
          "Zinedine Zidane",
        ]),
      });
    }
    if (p.winningCaptain) {
      out.push({
        prompt: `Who captained ${name} when they won the World Cup in ${lastWin}?`,
        correctAnswer: p.winningCaptain,
        distractors: nameOptions(p.winningCaptain, [
          "Sergio Ramos",
          "Neymar",
          "Thomas Müller",
          "Virgil van Dijk",
        ]),
      });
    }
  } else {
    out.push({
      prompt: `Has ${name} ever won the FIFA World Cup?`,
      correctAnswer: "No",
      distractors: ["Yes", "Yes, once", "Yes, twice"],
    });
  }

  if (p.topScorer) {
    out.push({
      prompt: `Who is ${name}'s all-time leading World Cup goalscorer?`,
      correctAnswer: p.topScorer,
      distractors: nameOptions(p.topScorer, [
        "Cristiano Ronaldo",
        "Lionel Messi",
        "Neymar",
        "Kylian Mbappé",
        "Harry Kane",
        "Robert Lewandowski",
      ]),
    });
  }

  if (p.bestFinish && p.bestFinishYear) {
    out.push({
      prompt: `What is ${name}'s best ever finish at a World Cup?`,
      correctAnswer: p.bestFinish,
      distractors: nameOptions(p.bestFinish, [
        "Winners",
        "Runners-up",
        "Semi-finals",
        "Quarter-finals",
        "Round of 16",
        "Group stage",
      ]),
    });
    out.push({
      prompt: `In which year did ${name} achieve their best World Cup finish (${p.bestFinish})?`,
      correctAnswer: String(p.bestFinishYear),
      distractors: yearOptions(p.bestFinishYear),
    });
  }

  if (p.starsAtBestRun) {
    out.push({
      prompt: `Which ${name} star shone at their famous World Cup run?`,
      correctAnswer: p.starsAtBestRun,
      distractors: nameOptions(p.starsAtBestRun, [
        "Lionel Messi",
        "Cristiano Ronaldo",
        "Neymar",
        "Mohamed Salah",
        "Son Heung-min",
      ]),
    });
  }

  if (p.notableRunNote && p.notableRunYear) {
    out.push({
      prompt: `Which World Cup year matches this ${name} fact: "${p.notableRunNote}"?`,
      correctAnswer: String(p.notableRunYear),
      distractors: yearOptions(p.notableRunYear),
    });
  }

  out.push({
    prompt: `Which nation won the most recent FIFA World Cup before ${name}'s 2026 campaign?`,
    correctAnswer: LAST_CHAMPION.country,
    distractors: nameOptions(LAST_CHAMPION.country, [
      "France",
      "Germany",
      "Brazil",
      "Spain",
      "England",
    ]),
  });

  out.push({
    prompt: "In what year was the last FIFA World Cup held before 2026?",
    correctAnswer: String(LAST_CHAMPION.year),
    distractors: yearOptions(LAST_CHAMPION.year),
  });

  out.push({
    prompt: "Who is the all-time leading goalscorer in FIFA World Cup history?",
    correctAnswer: "Miroslav Klose",
    distractors: ["Ronaldo", "Lionel Messi", "Pelé"],
  });

  return out;
}

const TEAM_WC_EXTRA: Partial<Record<string, TeamHistoryQuestion[]>> = {
  esp: [
    {
      prompt: "Who scored the winning goal for Spain in the 2010 World Cup final?",
      correctAnswer: "Andrés Iniesta",
      distractors: ["David Villa", "Xavi", "Fernando Torres"],
    },
    {
      prompt: "Who was Spain's top scorer at the 2010 World Cup?",
      correctAnswer: "David Villa",
      distractors: ["Fernando Torres", "David Silva", "Pedro"],
    },
    {
      prompt: "Spain lost to which country in the Round of 16 at the 2022 World Cup?",
      correctAnswer: "Morocco",
      distractors: ["France", "Germany", "Japan", "Croatia"],
    },
  ],
  arg: [
    {
      prompt: "Who scored twice for Argentina in the 2022 World Cup final?",
      correctAnswer: "Lionel Messi",
      distractors: ["Ángel Di María", "Julián Álvarez", "Lautaro Martínez"],
    },
    {
      prompt: "Who did Argentina beat on penalties in the 2022 World Cup quarter-finals?",
      correctAnswer: "Netherlands",
      distractors: ["Brazil", "Croatia", "France", "Germany"],
    },
  ],
  bra: [
    {
      prompt: "Brazil's last World Cup title came in which year?",
      correctAnswer: "2002",
      distractors: ["1994", "2006", "2010", "2018"],
    },
    {
      prompt: "Which Brazilian is their all-time top scorer at World Cups with 15 goals?",
      correctAnswer: "Ronaldo",
      distractors: ["Pelé", "Neymar", "Romário", "Rivaldo"],
    },
  ],
  ger: [
    {
      prompt: "Who holds the all-time record for most World Cup goals (16)?",
      correctAnswer: "Miroslav Klose",
      distractors: ["Thomas Müller", "Gerd Müller", "Lukas Podolski"],
    },
    {
      prompt: "Germany's 2014 final win came against which South American nation?",
      correctAnswer: "Argentina",
      distractors: ["Brazil", "Uruguay", "Colombia", "Chile"],
    },
  ],
  fra: [
    {
      prompt: "Who scored a hat-trick for France in the 2022 World Cup final?",
      correctAnswer: "Kylian Mbappé",
      distractors: ["Antoine Griezmann", "Olivier Giroud", "Ousmane Dembélé"],
    },
    {
      prompt: "France won their first World Cup in which year?",
      correctAnswer: "1998",
      distractors: ["2002", "2006", "2010", "2014"],
    },
  ],
  eng: [
    {
      prompt: "England's only World Cup triumph came in which year?",
      correctAnswer: "1966",
      distractors: ["1962", "1970", "1990", "2018"],
    },
    {
      prompt: "Who scored a famous hat-trick for England in the 1966 final?",
      correctAnswer: "Geoff Hurst",
      distractors: ["Bobby Charlton", "Gary Lineker", "Harry Kane"],
    },
  ],
  por: [
    {
      prompt: "Which Portugal legend scored nine goals at the 1966 World Cup?",
      correctAnswer: "Eusébio",
      distractors: ["Cristiano Ronaldo", "Luís Figo", "Pauleta"],
    },
  ],
  cro: [
    {
      prompt: "Who won the Golden Ball at the 2018 World Cup for Croatia?",
      correctAnswer: "Luka Modrić",
      distractors: ["Ivan Rakitić", "Mario Mandžukić", "Davor Šuker"],
    },
  ],
  col: [
    {
      prompt: "Who won the Golden Boot at the 2014 World Cup for Colombia?",
      correctAnswer: "James Rodríguez",
      distractors: ["Radamel Falcao", "Carlos Bacca", "Juan Cuadrado"],
    },
  ],
};

export function getTeamWcQuestionPool(team: Team): TeamHistoryQuestion[] {
  const profile = TEAM_WC_PROFILES[team.id];
  if (!profile) return [];

  const generated = buildFromProfile(team, profile);
  const extra = TEAM_WC_EXTRA[team.id] ?? [];
  const merged = [...extra, ...generated];

  const seen = new Set<string>();
  return merged.filter((q) => {
    if (seen.has(q.prompt)) return false;
    seen.add(q.prompt);
    return q.distractors.length === 3 && q.distractors.every((d) => d !== q.correctAnswer);
  });
}

export function pickTeamWcQuestions(
  team: Team,
  count: number,
  rand: () => number,
): TeamHistoryQuestion[] {
  const pool = getTeamWcQuestionPool(team);
  if (pool.length === 0) return [];
  if (pool.length <= count) return shuffle([...pool], rand);
  return pickN(pool, count, rand);
}
