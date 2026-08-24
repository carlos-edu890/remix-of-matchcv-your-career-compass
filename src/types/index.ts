// Modelos de dados do MatchCV.
// Nomeados e estruturados para migração direta a tabelas de banco no futuro.

export type ID = string;

export type WorkMode = "remoto" | "hibrido" | "presencial";
export type SeniorityLevel = "estagio" | "junior" | "pleno" | "senior" | "especialista";
export type SkillLevel = "basico" | "intermediario" | "avancado" | "especialista";
export type LanguageLevel = "basico" | "intermediario" | "avancado" | "fluente" | "nativo";

/** tabela: profile */
export interface Profile {
  id: ID;
  fullName: string;
  headline: string; // cargo desejado
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string; // resumo profissional
  createdAt: string;
  updatedAt: string;
}

/** tabela: experiences */
export interface Experience {
  id: ID;
  profileId: ID;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string;
  achievements: string;
}

/** tabela: education */
export interface Education {
  id: ID;
  profileId: ID;
  institution: string;
  course: string;
  degree: string;
  startDate: string;
  endDate: string;
  inProgress: boolean;
}

/** tabelas: skills + user_skills */
export interface UserSkill {
  id: ID;
  profileId: ID;
  name: string;
  level: SkillLevel;
}

/** tabela: languages */
export interface LanguageEntry {
  id: ID;
  profileId: ID;
  name: string;
  level: LanguageLevel;
}

/** tabela: certifications */
export interface Certification {
  id: ID;
  profileId: ID;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

/** tabela: projects */
export interface ProjectEntry {
  id: ID;
  profileId: ID;
  name: string;
  description: string;
  url: string;
  techs: string[];
}

/** objetivo profissional (parte de profile) */
export interface CareerGoal {
  targetRole: string;
  area: string;
  workMode: WorkMode;
  desiredLocation: string;
  salaryExpectation: string;
}

/** tabelas: jobs + job_skills */
export interface Job {
  id: ID;
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  workMode: WorkMode;
  seniority: SeniorityLevel;
  area: string;
  salaryMin: number;
  salaryMax: number;
  publishedAt: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  requiredYears: number;
  requiredEducation: string;
  requiredLanguages: { name: string; level: LanguageLevel }[];
  isDemoData: true;
}

export interface MatchBreakdownItem {
  key: "skills" | "experience" | "education" | "location" | "languages";
  label: string;
  weight: number;
  score: number;
}

/** tabela: matches */
export interface MatchResult {
  jobId: ID;
  finalScore: number;
  breakdown: MatchBreakdownItem[];
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  yearsUser: number;
  yearsRequired: number;
  recommendation: string;
}

export type ApplicationStatus =
  | "salvas"
  | "aplicado"
  | "entrevista"
  | "teste"
  | "oferta"
  | "rejeitado";

/** tabela: applications */
export interface Application {
  id: ID;
  jobId: ID;
  status: ApplicationStatus;
  date: string;
  resumeId: ID | null;
  notes: string;
}

export interface ResumeSectionVisibility {
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  languages: boolean;
  certifications: boolean;
  projects: boolean;
}

/** tabelas: resumes + resume_versions + resume_sections */
export interface Resume {
  id: ID;
  name: string;
  jobId: ID | null;
  jobTitle: string | null;
  isBase: boolean;
  headline: string;
  summary: string;
  keywords: string[];
  experienceIds: ID[];
  educationIds: ID[];
  skillNames: string[];
  languageIds: ID[];
  certificationIds: ID[];
  projectIds: ID[];
  sections: ResumeSectionVisibility;
  atsScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface AtsBreakdownItem {
  key: string;
  label: string;
  score: number;
}

export interface AtsRecommendation {
  status: "ok" | "warn" | "fail";
  message: string;
}

export interface AtsAnalysis {
  score: number;
  breakdown: AtsBreakdownItem[];
  recommendations: AtsRecommendation[];
  presentKeywords: string[];
  missingKeywords: string[];
}

/** tabela: notifications (preferências) */
export interface NotificationPrefs {
  newMatchingJobs: boolean;
  applicationUpdates: boolean;
  resumeSuggestions: boolean;
}

/** tabela: saved_jobs */
export interface AppState {
  profile: Profile;
  goal: CareerGoal;
  experiences: Experience[];
  education: Education[];
  skills: UserSkill[];
  languages: LanguageEntry[];
  certifications: Certification[];
  projects: ProjectEntry[];
  savedJobIds: ID[];
  applications: Application[];
  resumes: Resume[];
  notifications: NotificationPrefs;
  onboardingCompleted: boolean;
}
