import type {
  AppState,
  AtsAnalysis,
  AtsRecommendation,
  Job,
  Resume,
  ResumeSectionVisibility,
} from "@/types";
import { normalize, totalYearsOfExperience } from "./matching";
import { uid } from "./storage";

/**
 * ATS ENGINE
 * Implementação determinística (sem IA) para análise de vagas e currículos.
 * A assinatura das funções foi pensada para ser substituída por uma API de IA
 * futuramente, sem alterar os componentes de interface.
 *
 * REGRA: nunca inventar experiências, empresas, cargos ou skills.
 * Todo conteúdo gerado deriva exclusivamente do que o usuário informou.
 */

const STOP_WORDS = new Set([
  "para",
  "com",
  "uma",
  "dos",
  "das",
  "que",
  "por",
  "nos",
  "nas",
  "mais",
  "como",
  "sobre",
  "seu",
  "sua",
  "the",
  "and",
  "you",
  "our",
  "will",
  "atuacao",
  "trabalho",
  "equipe",
  "time",
  "vaga",
  "empresa",
]);

/** Extrai palavras-chave relevantes de uma descrição de vaga. */
export function extractKeywords(text: string, extra: string[] = []): string[] {
  const fromSkills = extra.filter(Boolean);
  const words = normalize(text)
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP_WORDS.has(w));
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const topWords = [...freq.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);

  const seen = new Set<string>();
  return [...fromSkills, ...topWords].filter((k) => {
    const key = normalize(k);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface JobAnalysis {
  keywords: string[];
  met: string[];
  partial: string[];
  unmet: string[];
}

/** Analisa a vaga contra o perfil atual, separando requisitos por atendimento. */
export function analyzeJob(job: Job, state: AppState): JobAnalysis {
  const userSkills = new Map(state.skills.map((s) => [normalize(s.name), s.level]));
  const met: string[] = [];
  const partial: string[] = [];
  const unmet: string[] = [];

  for (const skill of job.requiredSkills) {
    const level = userSkills.get(normalize(skill));
    if (!level) unmet.push(skill);
    else if (level === "basico") partial.push(`${skill} (nível básico)`);
    else met.push(skill);
  }
  for (const skill of job.niceToHaveSkills) {
    const level = userSkills.get(normalize(skill));
    if (level) met.push(`${skill} (desejável)`);
    else partial.push(`${skill} (desejável — não informado)`);
  }

  const years = totalYearsOfExperience(state);
  if (job.requiredYears > 0) {
    const label = `${job.requiredYears} anos de experiência`;
    if (years >= job.requiredYears) met.push(label);
    else if (years >= job.requiredYears * 0.6)
      partial.push(`${label} (você possui ${years})`);
    else unmet.push(`${label} (você possui ${years})`);
  }

  for (const lang of job.requiredLanguages) {
    const owned = state.languages.find((l) => normalize(l.name) === normalize(lang.name));
    const label = `${lang.name} ${lang.level}`;
    if (!owned) unmet.push(label);
    else if (owned.level === lang.level || owned.level === "nativo" || owned.level === "fluente")
      met.push(label);
    else partial.push(`${label} (você informou ${owned.level})`);
  }

  return {
    keywords: extractKeywords(job.description, [...job.requiredSkills, ...job.niceToHaveSkills]),
    met,
    partial,
    unmet,
  };
}

export const defaultSections: ResumeSectionVisibility = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  languages: true,
  certifications: true,
  projects: true,
};

/** Sugestão de melhoria por bullet point — só reforça o que já existe. */
export interface Suggestion {
  id: string;
  label: string;
  current: string;
  suggested: string;
}

export function suggestImprovements(state: AppState, job: Job | null): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const jobSkills = job ? [...job.requiredSkills, ...job.niceToHaveSkills] : [];
  const ownedJobSkills = jobSkills.filter((skill) =>
    state.skills.some((s) => normalize(s.name) === normalize(skill)),
  );

  if (state.profile.summary.length < 220 && ownedJobSkills.length) {
    suggestions.push({
      id: "summary",
      label: "Resumo profissional",
      current: state.profile.summary || "(sem resumo profissional)",
      suggested: buildSummary(state, job),
    });
  }

  for (const exp of state.experiences) {
    const text = [exp.description, exp.responsibilities].filter(Boolean).join(" ");
    const relevant = ownedJobSkills.filter((s) => !normalize(text).includes(normalize(s)));
    if (!text) {
      suggestions.push({
        id: exp.id,
        label: `${exp.role} — ${exp.company}`,
        current: "(descrição vazia)",
        suggested:
          "Descreva suas entregas nesta experiência usando verbos de ação e resultados mensuráveis.",
      });
      continue;
    }
    if (relevant.length) {
      suggestions.push({
        id: exp.id,
        label: `${exp.role} — ${exp.company}`,
        current: text,
        suggested: `${text.replace(/\.$/, "")}, utilizando ${relevant.slice(0, 3).join(", ")}.`,
      });
    }
    if (!/\d/.test(exp.achievements || "")) {
      suggestions.push({
        id: `${exp.id}_metrics`,
        label: `${exp.role} — resultados mensuráveis`,
        current: exp.achievements || "(sem resultados informados)",
        suggested:
          "Adicione números reais das suas entregas (ex.: redução de 30% no tempo de carregamento).",
      });
    }
  }

  return suggestions;
}

function buildSummary(state: AppState, job: Job | null): string {
  const role = state.goal.targetRole || state.profile.headline || "Profissional";
  const years = totalYearsOfExperience(state);
  const topSkills = state.skills
    .filter((s) => s.level !== "basico")
    .slice(0, 6)
    .map((s) => s.name);
  const focus = job
    ? job.requiredSkills.filter((s) => state.skills.some((u) => normalize(u.name) === normalize(s)))
    : [];
  const skillList = (focus.length ? focus : topSkills).slice(0, 6).join(", ");
  const parts = [
    `${role}${years ? ` com ${years} anos de experiência` : ""}.`,
    skillList ? `Atuação com ${skillList}.` : "",
    state.experiences[0]
      ? `Experiência mais recente como ${state.experiences[0].role} na ${state.experiences[0].company}.`
      : "",
  ];
  return parts.filter(Boolean).join(" ");
}

/** Gera uma versão do currículo otimizada para a vaga, sem inventar dados. */
export function generateOptimizedResume(
  state: AppState,
  job: Job,
  options?: { name?: string; applySummary?: boolean },
): Resume {
  const analysis = analyzeJob(job, state);
  const ownedFirst = [...state.skills]
    .sort((a, b) => {
      const aRel = job.requiredSkills.some((s) => normalize(s) === normalize(a.name)) ? 1 : 0;
      const bRel = job.requiredSkills.some((s) => normalize(s) === normalize(b.name)) ? 1 : 0;
      return bRel - aRel;
    })
    .map((s) => s.name);

  const now = new Date().toISOString();
  const resume: Resume = {
    id: uid("resume"),
    name: options?.name ?? `Currículo — ${job.title} (${job.company})`,
    jobId: job.id,
    jobTitle: `${job.title} · ${job.company}`,
    isBase: false,
    headline: job.title,
    summary:
      options?.applySummary === false
        ? state.profile.summary
        : buildSummary(state, job) || state.profile.summary,
    keywords: analysis.keywords,
    experienceIds: state.experiences.map((e) => e.id),
    educationIds: state.education.map((e) => e.id),
    skillNames: ownedFirst,
    languageIds: state.languages.map((l) => l.id),
    certificationIds: state.certifications.map((c) => c.id),
    projectIds: state.projects.map((p) => p.id),
    sections: { ...defaultSections },
    atsScore: 0,
    createdAt: now,
    updatedAt: now,
  };
  resume.atsScore = analyzeResume(resume, state, job).score;
  return resume;
}

export function createBaseResume(state: AppState): Resume {
  const now = new Date().toISOString();
  return {
    id: uid("resume"),
    name: "Currículo principal",
    jobId: null,
    jobTitle: null,
    isBase: true,
    headline: state.profile.headline || state.goal.targetRole,
    summary: state.profile.summary,
    keywords: state.skills.map((s) => s.name),
    experienceIds: state.experiences.map((e) => e.id),
    educationIds: state.education.map((e) => e.id),
    skillNames: state.skills.map((s) => s.name),
    languageIds: state.languages.map((l) => l.id),
    certificationIds: state.certifications.map((c) => c.id),
    projectIds: state.projects.map((p) => p.id),
    sections: { ...defaultSections },
    atsScore: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function resumeFullText(resume: Resume, state: AppState): string {
  const exps = state.experiences.filter((e) => resume.experienceIds.includes(e.id));
  return [
    resume.headline,
    resume.summary,
    ...exps.map((e) =>
      [e.role, e.company, e.description, e.responsibilities, e.achievements].join(" "),
    ),
    ...resume.skillNames,
    ...state.certifications
      .filter((c) => resume.certificationIds.includes(c.id))
      .map((c) => c.name),
    ...state.projects
      .filter((p) => resume.projectIds.includes(p.id))
      .map((p) => `${p.name} ${p.description} ${p.techs.join(" ")}`),
  ].join(" \n ");
}

/** Calcula o ATS Score do currículo, opcionalmente contra uma vaga alvo. */
export function analyzeResume(resume: Resume, state: AppState, job: Job | null): AtsAnalysis {
  const text = normalize(resumeFullText(resume, state));
  const keywords = job
    ? extractKeywords(job.description, [...job.requiredSkills, ...job.niceToHaveSkills])
    : resume.keywords;

  const presentKeywords = keywords.filter((k) => text.includes(normalize(k)));
  const missingKeywords = keywords.filter((k) => !text.includes(normalize(k)));

  const keywordScore = keywords.length
    ? Math.round((presentKeywords.length / keywords.length) * 100)
    : 80;

  const exps = state.experiences.filter((e) => resume.experienceIds.includes(e.id));
  const structureChecks = [
    Boolean(state.profile.fullName),
    Boolean(state.profile.email || state.profile.phone),
    Boolean(resume.summary) && resume.sections.summary,
    exps.length > 0 && resume.sections.experience,
    resume.educationIds.length > 0 && resume.sections.education,
    resume.skillNames.length >= 3 && resume.sections.skills,
  ];
  const structureScore = Math.round(
    (structureChecks.filter(Boolean).length / structureChecks.length) * 100,
  );

  const detailed = exps.filter((e) => (e.description + e.responsibilities).length > 60);
  const withMetrics = exps.filter((e) => /\d/.test(e.achievements || e.description || ""));
  const experienceScore = exps.length
    ? Math.round(((detailed.length / exps.length) * 0.6 + (withMetrics.length / exps.length) * 0.4) * 100)
    : 0;

  const relevantSkills = job
    ? job.requiredSkills.filter((s) => resume.skillNames.some((n) => normalize(n) === normalize(s)))
        .length / Math.max(1, job.requiredSkills.length)
    : Math.min(1, resume.skillNames.length / 8);
  const skillsScore = Math.round(relevantSkills * 100);

  const summaryLength = resume.summary.length;
  const readabilityScore = Math.round(
    Math.min(
      100,
      60 +
        (summaryLength > 80 && summaryLength < 700 ? 20 : 0) +
        (resume.skillNames.length <= 25 ? 10 : 0) +
        (exps.every((e) => e.startDate) ? 10 : 0),
    ),
  );

  const breakdown = [
    { key: "keywords", label: "Keywords", score: keywordScore },
    { key: "structure", label: "Estrutura", score: structureScore },
    { key: "experience", label: "Experiência", score: experienceScore },
    { key: "skills", label: "Skills", score: skillsScore },
    { key: "readability", label: "Legibilidade", score: readabilityScore },
  ];

  const score = Math.round(
    keywordScore * 0.3 +
      structureScore * 0.25 +
      experienceScore * 0.2 +
      skillsScore * 0.15 +
      readabilityScore * 0.1,
  );

  const recommendations: AtsRecommendation[] = [];
  recommendations.push(
    structureScore >= 90
      ? { status: "ok", message: "Estrutura compatível com ATS (texto simples, coluna única)." }
      : { status: "warn", message: "Complete dados de contato e seções básicas do currículo." },
  );
  recommendations.push(
    keywordScore >= 70
      ? { status: "ok", message: "Palavras-chave relevantes presentes no currículo." }
      : {
          status: "fail",
          message: `Faltam palavras-chave da vaga: ${missingKeywords.slice(0, 4).join(", ")}.`,
        },
  );
  if (exps.length) {
    const missingMetrics = exps.filter((e) => !/\d/.test(e.achievements || ""));
    if (missingMetrics.length === 0) {
      recommendations.push({ status: "ok", message: "Experiências com resultados mensuráveis." });
    } else {
      recommendations.push({
        status: "warn",
        message: `Adicione resultados mensuráveis à experiência ${missingMetrics[0]!.role} — ${missingMetrics[0]!.company}.`,
      });
    }
  } else {
    recommendations.push({
      status: "fail",
      message: "Nenhuma experiência incluída neste currículo.",
    });
  }
  if (resume.skillNames.length < 5) {
    recommendations.push({
      status: "warn",
      message: "Liste ao menos 5 habilidades técnicas relevantes.",
    });
  } else {
    recommendations.push({ status: "ok", message: "Quantidade de skills adequada para leitura ATS." });
  }

  return { score, breakdown, recommendations, presentKeywords, missingKeywords };
}
