import type { AppState, Job, LanguageLevel, MatchResult, SkillLevel } from "@/types";

/**
 * MATCH ENGINE
 * Cálculo determinístico e modular do Match Score.
 * Pode ser substituído por uma API/IA mantendo a assinatura de `calculateMatch`.
 */

const WEIGHTS = {
  skills: 40,
  experience: 25,
  education: 15,
  location: 10,
  languages: 10,
} as const;

const SKILL_LEVEL_VALUE: Record<SkillLevel, number> = {
  basico: 0.6,
  intermediario: 0.8,
  avancado: 0.95,
  especialista: 1,
};

const LANGUAGE_LEVEL_VALUE: Record<LanguageLevel, number> = {
  basico: 1,
  intermediario: 2,
  avancado: 3,
  fluente: 4,
  nativo: 5,
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#. ]/g, "")
    .trim();
}

export function totalYearsOfExperience(state: AppState): number {
  let months = 0;
  for (const exp of state.experiences) {
    const start = parseMonth(exp.startDate);
    const end = exp.current ? new Date() : parseMonth(exp.endDate);
    if (!start || !end) continue;
    months += Math.max(
      0,
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()),
    );
  }
  return Math.round((months / 12) * 10) / 10;
}

function parseMonth(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function skillsScore(state: AppState, job: Job) {
  const userSkills = new Map(state.skills.map((s) => [normalize(s.name), s.level]));
  const matched: string[] = [];
  const missing: string[] = [];
  const partial: string[] = [];

  let earned = 0;
  const requiredWeight = job.requiredSkills.length * 1;
  const niceWeight = job.niceToHaveSkills.length * 0.35;
  const total = requiredWeight + niceWeight || 1;

  for (const skill of job.requiredSkills) {
    const level = userSkills.get(normalize(skill));
    if (level) {
      earned += SKILL_LEVEL_VALUE[level];
      if (level === "basico") partial.push(skill);
      else matched.push(skill);
    } else {
      missing.push(skill);
    }
  }
  for (const skill of job.niceToHaveSkills) {
    const level = userSkills.get(normalize(skill));
    if (level) {
      earned += 0.35 * SKILL_LEVEL_VALUE[level];
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  return {
    score: Math.round((earned / total) * 100),
    matched,
    missing,
    partial,
  };
}

function experienceScore(years: number, required: number) {
  if (required <= 0) return 100;
  return Math.round(Math.min(1, years / required) * 100);
}

function educationScore(state: AppState, job: Job) {
  if (!job.requiredEducation) return 100;
  if (state.education.length === 0) return 30;
  const completed = state.education.some((e) => !e.inProgress);
  const wantsDegree = /superior|engenharia|computa/i.test(job.requiredEducation);
  if (!wantsDegree) return 100;
  return completed ? 100 : 70;
}

function locationScore(state: AppState, job: Job) {
  const goal = state.goal;
  let score = 60;
  if (job.workMode === "remoto") score = 100;
  else if (goal.workMode === job.workMode) score = 95;
  else if (goal.workMode === "hibrido" && job.workMode === "presencial") score = 75;

  const userCity = normalize(goal.desiredLocation || state.profile.location).split(",")[0] ?? "";
  const jobCity = normalize(job.location).split(",")[0] ?? "";
  if (job.workMode !== "remoto" && userCity && jobCity && userCity === jobCity) {
    score = Math.max(score, 90);
  } else if (job.workMode !== "remoto" && userCity && jobCity && userCity !== jobCity) {
    score = Math.min(score, 55);
  }
  return score;
}

function languagesScore(state: AppState, job: Job) {
  if (job.requiredLanguages.length === 0) return 100;
  let sum = 0;
  for (const req of job.requiredLanguages) {
    const owned = state.languages.find((l) => normalize(l.name) === normalize(req.name));
    if (!owned) continue;
    const ratio = LANGUAGE_LEVEL_VALUE[owned.level] / LANGUAGE_LEVEL_VALUE[req.level];
    sum += Math.min(1, ratio);
  }
  const base = (sum / job.requiredLanguages.length) * 100;
  const certBonus = Math.min(10, state.certifications.length * 5);
  return Math.round(Math.min(100, base + certBonus));
}

export function calculateMatch(state: AppState, job: Job): MatchResult {
  const skills = skillsScore(state, job);
  const years = totalYearsOfExperience(state);
  const experience = experienceScore(years, job.requiredYears);
  const education = educationScore(state, job);
  const location = locationScore(state, job);
  const languages = languagesScore(state, job);

  const breakdown = [
    { key: "skills" as const, label: "Skills", weight: WEIGHTS.skills, score: skills.score },
    {
      key: "experience" as const,
      label: "Experiência",
      weight: WEIGHTS.experience,
      score: experience,
    },
    { key: "education" as const, label: "Formação", weight: WEIGHTS.education, score: education },
    { key: "location" as const, label: "Localização", weight: WEIGHTS.location, score: location },
    { key: "languages" as const, label: "Idiomas", weight: WEIGHTS.languages, score: languages },
  ];

  const finalScore = Math.round(
    breakdown.reduce((acc, item) => acc + (item.score * item.weight) / 100, 0),
  );

  return {
    jobId: job.id,
    finalScore: Math.max(0, Math.min(100, finalScore)),
    breakdown,
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
    partialSkills: skills.partial,
    yearsUser: years,
    yearsRequired: job.requiredYears,
    recommendation: buildRecommendation(finalScore, skills.missing, years, job),
  };
}

function buildRecommendation(score: number, missing: string[], years: number, job: Job): string {
  if (score === 0) {
    return "Preencha seu perfil para que possamos calcular sua compatibilidade com esta vaga.";
  }
  const gapText = missing.length
    ? `O principal gap é ${missing.slice(0, 2).join(" e ")}.`
    : "Você atende a todos os requisitos técnicos listados.";
  const expText =
    years < job.requiredYears
      ? ` Você tem ${years} de ${job.requiredYears} anos de experiência exigidos — destaque resultados mensuráveis para compensar.`
      : "";

  if (score >= 80)
    return `Você possui grande compatibilidade com esta vaga. ${gapText}${expText}`;
  if (score >= 60)
    return `Boa compatibilidade. Vale se candidatar destacando suas skills alinhadas. ${gapText}${expText}`;
  if (score >= 40)
    return `Compatibilidade média. Ajuste seu currículo para as palavras-chave da vaga. ${gapText}${expText}`;
  return `Compatibilidade baixa por enquanto. ${gapText}${expText}`;
}

export type MatchTier = "excelente" | "bom" | "medio" | "baixo";

export function matchTier(score: number): MatchTier {
  if (score >= 80) return "excelente";
  if (score >= 60) return "bom";
  if (score >= 40) return "medio";
  return "baixo";
}

export const matchTierLabel: Record<MatchTier, string> = {
  excelente: "Excelente",
  bom: "Bom",
  medio: "Médio",
  baixo: "Baixo",
};
