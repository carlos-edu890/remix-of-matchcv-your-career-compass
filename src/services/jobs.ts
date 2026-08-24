import { demoJobs } from "@/data/demo-jobs";
import type { Job } from "@/types";

/**
 * Serviço de vagas. Hoje lê dados de demonstração locais.
 * Futuro: trocar por fetch a uma API mantendo a mesma assinatura.
 */
export function listJobs(): Job[] {
  return demoJobs;
}

export function getJobById(id: string): Job | undefined {
  return demoJobs.find((job) => job.id === id);
}

export interface JobFilters {
  query: string;
  location: string;
  workMode: string;
  seniority: string;
  area: string;
  company: string;
  minSalary: number;
  minMatch: number;
}

export const emptyFilters: JobFilters = {
  query: "",
  location: "todas",
  workMode: "todas",
  seniority: "todas",
  area: "todas",
  company: "todas",
  minSalary: 0,
  minMatch: 0,
};

export type JobSort = "match" | "recent" | "salary" | "relevance";

export function filterJobs(
  jobs: Job[],
  filters: JobFilters,
  scoreOf: (job: Job) => number,
): Job[] {
  const q = filters.query.trim().toLowerCase();
  return jobs.filter((job) => {
    if (
      q &&
      ![job.title, job.company, job.area, ...job.requiredSkills, ...job.niceToHaveSkills]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
      return false;
    if (filters.location !== "todas" && job.location !== filters.location) return false;
    if (filters.workMode !== "todas" && job.workMode !== filters.workMode) return false;
    if (filters.seniority !== "todas" && job.seniority !== filters.seniority) return false;
    if (filters.area !== "todas" && job.area !== filters.area) return false;
    if (filters.company !== "todas" && job.company !== filters.company) return false;
    if (filters.minSalary && job.salaryMax < filters.minSalary) return false;
    if (filters.minMatch && scoreOf(job) < filters.minMatch) return false;
    return true;
  });
}

export function sortJobs(jobs: Job[], sort: JobSort, scoreOf: (job: Job) => number): Job[] {
  const copy = [...jobs];
  switch (sort) {
    case "recent":
      return copy.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    case "salary":
      return copy.sort((a, b) => b.salaryMax - a.salaryMax);
    case "relevance":
      return copy.sort(
        (a, b) =>
          scoreOf(b) * 0.7 +
          (+new Date(b.publishedAt) / 1e13) * 30 -
          (scoreOf(a) * 0.7 + (+new Date(a.publishedAt) / 1e13) * 30),
      );
    case "match":
    default:
      return copy.sort((a, b) => scoreOf(b) - scoreOf(a));
  }
}
