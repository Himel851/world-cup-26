import { TEAMS, CONTINENTS, GROUPS } from "@/data/teams";
import type {
  Continent,
  GroupLetter,
  QuizQuestion,
  QuizType,
  Team,
} from "@/types";
import { pickN, pickRandom, seedFromDate, seededRandom, shuffle } from "./utils";

const QUESTION_TIME_LIMIT: Record<QuizType, number> = {
  flag: 20,
  captain: 22,
  ranking: 18,
  continent: 18,
  group: 20,
};

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

// ─────────────────────────────────────────────────────────────────
// Individual generators
// ─────────────────────────────────────────────────────────────────

export function generateFlagQuestion(rand: () => number = Math.random): QuizQuestion {
  const team = pickRandom(TEAMS, rand);
  const distractors = pickN(
    TEAMS.filter((t) => t.id !== team.id),
    3,
    rand,
  );
  const options = shuffle([team.name, ...distractors.map((t) => t.name)], rand);
  return {
    id: uid("flag"),
    type: "flag",
    prompt: "Which country does this flag belong to?",
    imageUrl: team.flag,
    options,
    correctAnswer: team.name,
    timeLimit: QUESTION_TIME_LIMIT.flag,
    meta: { teamId: team.id },
  };
}

export function generateCaptainQuestion(rand: () => number = Math.random): QuizQuestion {
  const team = pickRandom(TEAMS, rand);
  const distractors = pickN(
    TEAMS.filter((t) => t.captain !== team.captain),
    3,
    rand,
  );
  const options = shuffle(
    [team.captain, ...distractors.map((t) => t.captain)],
    rand,
  );
  return {
    id: uid("cap"),
    type: "captain",
    prompt: `Who is the captain of ${team.name}?`,
    options,
    correctAnswer: team.captain,
    timeLimit: QUESTION_TIME_LIMIT.captain,
    meta: { teamId: team.id },
  };
}

export function generateRankingQuestion(rand: () => number = Math.random): QuizQuestion {
  const [a, b, c, d] = pickN(TEAMS, 4, rand);
  const ranked = [a, b, c, d].sort((x, y) => x.fifaRanking - y.fifaRanking);
  const best = ranked[0];
  const options = shuffle([a, b, c, d].map((t) => t.name), rand);
  return {
    id: uid("rank"),
    type: "ranking",
    prompt: "Which of these teams has the best (lowest) FIFA ranking?",
    options,
    correctAnswer: best.name,
    timeLimit: QUESTION_TIME_LIMIT.ranking,
  };
}

export function generateContinentQuestion(rand: () => number = Math.random): QuizQuestion {
  const continent = pickRandom([...CONTINENTS], rand) as Continent;
  const inContinent = TEAMS.filter((t) => t.continent === continent);
  if (inContinent.length === 0) return generateContinentQuestion(rand);
  const correctTeam = pickRandom(inContinent, rand);
  const distractors = pickN(
    TEAMS.filter((t) => t.continent !== continent),
    3,
    rand,
  );
  const options = shuffle(
    [correctTeam.name, ...distractors.map((t) => t.name)],
    rand,
  );
  return {
    id: uid("cont"),
    type: "continent",
    prompt: `Which of these teams belongs to ${continent}?`,
    options,
    correctAnswer: correctTeam.name,
    timeLimit: QUESTION_TIME_LIMIT.continent,
    meta: { continent },
  };
}

export function generateGroupQuestion(rand: () => number = Math.random): QuizQuestion {
  const group = pickRandom([...GROUPS], rand) as GroupLetter;
  const inGroup = TEAMS.filter((t) => t.group === group);
  if (inGroup.length === 0) return generateGroupQuestion(rand);
  const correctTeam = pickRandom(inGroup, rand);
  const distractors = pickN(
    TEAMS.filter((t) => t.group !== group),
    3,
    rand,
  );
  const options = shuffle(
    [correctTeam.name, ...distractors.map((t) => t.name)],
    rand,
  );
  return {
    id: uid("grp"),
    type: "group",
    prompt: `Which of these teams is in Group ${group}?`,
    options,
    correctAnswer: correctTeam.name,
    timeLimit: QUESTION_TIME_LIMIT.group,
    meta: { group },
  };
}

// ─────────────────────────────────────────────────────────────────
// Mixed generators
// ─────────────────────────────────────────────────────────────────

const GENERATORS: Record<QuizType, (rand?: () => number) => QuizQuestion> = {
  flag: generateFlagQuestion,
  captain: generateCaptainQuestion,
  ranking: generateRankingQuestion,
  continent: generateContinentQuestion,
  group: generateGroupQuestion,
};

export interface GenerateOptions {
  count?: number;
  types?: QuizType[];
  seed?: number;
}

export function generateQuiz(opts: GenerateOptions = {}): QuizQuestion[] {
  const { count = 10, types, seed } = opts;
  const rand = typeof seed === "number" ? seededRandom(seed) : Math.random;
  const pool = types && types.length > 0 ? types : (Object.keys(GENERATORS) as QuizType[]);
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const t = pool[i % pool.length];
    // For non-seeded play we randomise the type completely each step.
    const type = typeof seed === "number" ? t : (pickRandom(pool, rand) as QuizType);
    questions.push(GENERATORS[type](rand));
  }
  return questions;
}

/** A deterministic daily challenge that's identical for every visitor on a given day. */
export function generateDailyChallenge(date: Date = new Date()): QuizQuestion[] {
  const seed = seedFromDate(date);
  return generateQuiz({ count: 10, seed });
}

/** Generate a single team-focused quiz, used on the Team Details page. */
export function generateTeamQuiz(team: Team, count = 5): QuizQuestion[] {
  const rand = Math.random;
  const out: QuizQuestion[] = [];

  // Always include a flag question for this team
  out.push({
    ...generateFlagQuestion(rand),
    prompt: "Identify this flag",
    imageUrl: team.flag,
    correctAnswer: team.name,
    options: shuffle(
      [
        team.name,
        ...pickN(TEAMS.filter((t) => t.id !== team.id), 3, rand).map((t) => t.name),
      ],
      rand,
    ),
    meta: { teamId: team.id },
  });

  // And a captain question for this team
  out.push({
    ...generateCaptainQuestion(rand),
    prompt: `Who captains ${team.name}?`,
    correctAnswer: team.captain,
    options: shuffle(
      [
        team.captain,
        ...pickN(TEAMS.filter((t) => t.captain !== team.captain), 3, rand).map(
          (t) => t.captain,
        ),
      ],
      rand,
    ),
    meta: { teamId: team.id },
  });

  while (out.length < count) {
    const type = pickRandom<QuizType>(["ranking", "continent", "group"], rand);
    out.push(GENERATORS[type](rand));
  }
  return out;
}
