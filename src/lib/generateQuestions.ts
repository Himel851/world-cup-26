import { TEAMS, CONTINENTS, GROUPS } from "@/data/teams";
import type {
  Continent,
  GroupLetter,
  QuizQuestion,
  QuizType,
  Team,
  TeamWithRanking,
} from "@/types";
import { pickN, pickRandom, seedFromDate, seededRandom, shuffle } from "./utils";
import { pickTeamWcQuestions } from "./team-wc-quiz";

const QUESTION_TIME_LIMIT: Record<QuizType, number> = {
  flag: 20,
  ranking: 18,
  continent: 18,
  group: 20,
  history: 22,
};

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

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

export function generateRankingQuestion(
  teams: TeamWithRanking[],
  rand: () => number = Math.random,
): QuizQuestion {
  const pool = teams.filter((t) => t.ranking);
  if (pool.length < 4) {
    return generateContinentQuestion(rand);
  }
  const [a, b, c, d] = pickN(pool, 4, rand);
  const ranked = [a, b, c, d].sort(
    (x, y) => (x.ranking!.rank) - (y.ranking!.rank),
  );
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
  const options = shuffle([correctTeam.name, ...distractors.map((t) => t.name)], rand);
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
  const options = shuffle([correctTeam.name, ...distractors.map((t) => t.name)], rand);
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

export interface GenerateOptions {
  count?: number;
  types?: QuizType[];
  seed?: number;
  teams?: TeamWithRanking[];
}

const QUIZ_TYPES: QuizType[] = ["flag", "ranking", "continent", "group"];

export function generateQuiz(opts: GenerateOptions = {}): QuizQuestion[] {
  const { count = 10, types, seed, teams = [] } = opts;
  const rand = typeof seed === "number" ? seededRandom(seed) : Math.random;
  const pool = types && types.length > 0 ? types : QUIZ_TYPES;
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const t = pool[i % pool.length];
    const type = typeof seed === "number" ? t : (pickRandom(pool, rand) as QuizType);
    switch (type) {
      case "flag":
        questions.push(generateFlagQuestion(rand));
        break;
      case "ranking":
        questions.push(generateRankingQuestion(teams, rand));
        break;
      case "continent":
        questions.push(generateContinentQuestion(rand));
        break;
      case "group":
        questions.push(generateGroupQuestion(rand));
        break;
    }
  }
  return questions;
}

export function generateDailyChallenge(
  date: Date = new Date(),
  teams: TeamWithRanking[] = [],
): QuizQuestion[] {
  const seed = seedFromDate(date);
  return generateQuiz({ count: 10, seed, teams, types: ["flag"] });
}

export function generateTeamQuiz(team: Team, count = 10): QuizQuestion[] {
  const rand = Math.random;
  const picked = pickTeamWcQuestions(team, count, rand);

  return picked.map((q) => ({
    id: uid("hist"),
    type: "history" as const,
    prompt: q.prompt,
    options: shuffle([q.correctAnswer, ...q.distractors], rand),
    correctAnswer: q.correctAnswer,
    timeLimit: QUESTION_TIME_LIMIT.history,
    meta: { teamId: team.id },
  }));
}
